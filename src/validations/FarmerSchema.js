import * as Yup from "yup";
export const FarmerSchema = Yup.object().shape({
  // name: Yup.string().required("Please enter the farmer's name."),
  // mobile: Yup.string()
  //   .matches(
  //     /^[0-9]{10}$/,
  //     "Enter a valid 10-digit mobile number of the farmer."
  //   )
  //   .required("Farmer's mobile number is required."),
  // acre: Yup.string().required(
  //   "Please mention the number of acres under cultivation."
  // ),
  // remark: Yup.string().required(
  //   "Please add your visit remarks for this farmer."
  // ),
});
