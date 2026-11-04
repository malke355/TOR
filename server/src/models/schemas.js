/** Shared Mongoose options so API responses keep string `id` and hide Mongo internals. */
export const schemaOptions = {
  timestamps: false,
  versionKey: false,
  toJSON: {
    transform(_doc, ret) {
      delete ret._id;
      return ret;
    }
  },
  toObject: {
    transform(_doc, ret) {
      delete ret._id;
      return ret;
    }
  }
};
