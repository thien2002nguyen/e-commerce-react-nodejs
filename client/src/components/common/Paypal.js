// Paypal sandbox
// sb-pyi74729855281@personal.example.com || M9Qh$rm1
// sb-26flq29822256@business.example.com || 12345678
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { apiCart, apiCreateOrder, apiUpdateQuantityProduct } from "apis";
import withBaseComponent from "hocs/withBaseComponent";
import { memo } from "react";
import { toast } from "react-toastify";
import { showModal } from "store/app/appSlice";
import { getCurrent } from "store/user/asyncActions";
import CongratPay from "./CongratPay";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import path from "ultils/path";

const style = { "layout": "vertical" };

const ButtonWrapper = ({ current, currency, showSpinner, amount, payload, dispatch, navigate }) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const handleSaveOrder = async () => {
        const removeCart = await apiCart({ cart: [] })
        const products = []
        for (let item of current?.cart) {
            if (item.product?.quantity >= item.quantity) {
                let value = {
                    pid: item.product?._id,
                    quantity: item.product?.quantity - item.quantity,
                    sold: item.product?.sold + item.quantity
                }
                products.push(value)
            }
            else {
                toast.error(`Product ${item.title} is out of stock, sorry`)
            }
        }
        const updateQuantity = await apiUpdateQuantityProduct({ products })
        if (removeCart.success && updateQuantity.success) {
            const response = await apiCreateOrder({ ...payload, status: 'Shipping' })
            if (response.success) {
                dispatch(getCurrent())
                dispatch(showModal({ isShowModal: true, modalChildren: <CongratPay /> }))
                Swal.fire({
                    title: 'Congratulate!',
                    text: 'Order Success',
                    icon: 'success',
                    confirmButtonText: 'Continue shopping now'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        navigate(`/${path.PRODUCTS}`)
                        dispatch(showModal({ isShowModal: false, modalChildren: null }))
                    }
                })
            }
            else {
                toast.error(response.mes || removeCart.mes)
            }
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
    const { current } = useSelector(state => state.user)
    return (
        <div style={{ maxWidth: "750px", minHeight: "200px" }}>
            <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
                <ButtonWrapper current={current} navigate={navigate} dispatch={dispatch} payload={payload} currency={"USD"}
                    amount={amount} showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
}

export default withBaseComponent(memo(Paypal))