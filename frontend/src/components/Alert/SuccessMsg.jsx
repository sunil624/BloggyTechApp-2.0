import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { resetSuccessAction } from "../../redux/slices/globalSlices/globalSlice";
const SuccessMsg = ({message}) => {
    console.log("message rec in succ:", message);
    const dispatch = useDispatch()
    Swal.fire({
        icon:"success",
        title:"Good Job",
        text:message,
    });
    dispatch(resetSuccessAction());
};

export default SuccessMsg;