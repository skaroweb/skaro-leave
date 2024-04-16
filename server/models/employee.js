const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const Joi = require("joi");
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    absencetype: {
      type: String,
      // required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    permissionTime: {
      type: String, // Assuming permission time type is a string
      // required: true,
    },
    workFromHome: {
      type: String,
      // default: false, // Assuming it defaults to false
    },
    applydate: {
      type: Date,
      required: true,
    },
    currentuserid: {
      type: ObjectId,
      required: true,
    },
    compensation: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("employee", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    applydate: Joi.date().required().label("Date"),
    reason: Joi.string().required().label("Reason"),
    permissionTime: Joi.string().label("Permission Time").allow(null, ""),
    workFromHome: Joi.string().label("Work From Home").allow(null, ""),
    absencetype: Joi.string().label("Absence Type").allow(null, ""),
  })
    .or("permissionTime", "workFromHome", "absencetype")
    .custom((value, helpers) => {
      if (!value.permissionTime && !value.workFromHome && !value.absencetype) {
        return helpers.error("any.required");
      }
      return value;
    });

  return schema.validate(data, { allowUnknown: true });
};
module.exports = { UserModel, validate };
