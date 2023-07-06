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
      required: true,
    },
    applydate: {
      type: Date,
      required: true,
    },
    currentuserid: {
      type: ObjectId,
      required: true,
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
    absencetype: Joi.string().required().label("Absence type"),
    applydate: Joi.date().required().label("Date"),
  });
  return schema.validate(data, { allowUnknown: true });
};

module.exports = { UserModel, validate };
