"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static signup = async ({ name, email, password }) => {
    try {
      //step 1: check email exist
      const shop = await shopModel.findOne({ email }).lean();
      console.log("shop:", shop);
      //lean() giảm size obj trả về
      if (shop) {
        return {
          code: "xxx",
          message: "Shop already exist",
        };
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // create privateKey and publicKey cho level bảo mật cao, ít dùng,
        // vd: gitlab, aws ec2 dùng cái này , phải download file pem về máy
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });

        // Make it simple
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        console.log({ privateKey, publicKey }); // save collection keyStore

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxx",
            message: "PublicKey error",
          };
        }
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log("Created token success:", tokens);

        return {
          code: 201,
          metadata: {
            shop: getInfoData(["_id", "name", "email"], newShop),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
