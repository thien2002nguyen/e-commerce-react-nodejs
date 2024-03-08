// Paypal sandbox
// sb-pyi74729855281@personal.example.com
// M9Qh$rm1
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { apiCart, apiCreateOrder } from "apis";
import withBaseComponent from "hocs/withBaseComponent";
import { memo } from "react";
import { toast } from "react-toastify";
import { showModal } from "store/app/appSlice";
import { getCurrent } from "store/user/asyncActions";
import CongratPay from "./CongratPay";

const style = { "layout": "vertical" };

const ButtonWrapper = ({ currency, showSpinner, amount, payload, dispatch, navigate }) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const handleSaveOrder = async () => {
        const response = await apiCreateOrder(payload)
        if (response.success) {
            const updatecart = await apiCart({ cart: [] })
            if (updatecart.success) {
                dispatch(getCurrent())
                dispatch(showModal({ isShowModal: true, modalChildren: <CongratPay /> }))
            }
            else {
                toast.error(updatecart.mes)
            }
        }
        else {
            toast.error(response.mes)
        }
    }
    return (
        <>
            {(showSpinner && isPending) && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                createOrder={(data, actions) => actions.order.create({
                    purchase_units: [{
                        amount: {
                            currency_code: currency,
                            value: amount
                        }
                    }]
                }).then(orderID => orderID)}
                onApprove={(data, actions) => actions.order.capture().then(async (response) => {
                    if (response.status === 'COMPLETED') {
                        handleSaveOrder()
                    }
                })}
            />
        </>
    );
}

const Paypal = ({ amount, payload, dispatch, navigate }) => {
    return (
        <div style={{ maxWidth: "750px", minHeight: "200px" }}>
            <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
                <ButtonWrapper navigate={navigate} dispatch={dispatch} payload={payload} currency={"USD"}
                    amount={amount} showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
}

export default withBaseComponent(memo(Paypal))