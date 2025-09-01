import {useDispatch} from "react-redux";
import Swal from "sweetalert2";
import { resetErrorAction } from "../../redux/slices/globalSlices/globalSlice";

const ErrorMsg = ({message}) => {
    const dispatch = useDispatch();
    Swal.fire({
        icon:"error",
        title:"Oops",
        text:message,
    });
    dispatch(resetErrorAction());
};

export default ErrorMsg;