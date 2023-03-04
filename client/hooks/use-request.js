import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            setErrors(null);
            const response = await axios[method](url, body);
            return response.data;
        } catch(error) {
            setErrors(
                <div className="alert alert-danger">
                    <ul className="my-0">
                        { error.response.data.errors.map(err => <li key={ err.message }>{ err.message }</li>) }
                    </ul>
                </div>
            );
        }
    };

    return { doRequest, errors };
}
export default useRequest;