import * as Yup from "yup";

export const schemas = {
  l4_uc: Yup.object({
    identifier: Yup.string().required(),
  }),
};
