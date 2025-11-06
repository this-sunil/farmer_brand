import { body,validationResult } from "express-validator";
const productValidator=[
    body("title").notEmpty().withMessage("Missing title").isLength({min:5}).withMessage("Product title at least 5 character"),
    body("description").notEmpty().withMessage("Missing description"),
    body("qty").notEmpty().withMessage("Missing quantity"),
    body("stock").notEmpty().withMessage("Missing stock"),
    body("weight").notEmpty().withMessage("Missing weight"),
    body("cid").notEmpty().withMessage("Missing category id")
];
export default productValidator;