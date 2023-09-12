import React from 'react'
import styles from '../../styles/styles'

const CheckoutSteps = ({active}) => {
    console.log(active);
  return (
    <div className='w-full flex justify-center'>
        <div className="w-[90%] 800px:w-[50%] flex items-center flex-wrap">
               <div className={`${styles.noramlFlex}`}>
                <div className={`${styles.cart_button} !bg-[#143F6B]`}  >
                       <span className={`${styles.cart_button_text}`}>  1.Livraison </span>
                </div>
                <div className={`${
                    active > 1 ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#abc4dc]"
                    : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#ffff]"
                }`} />
               </div>

               <div className={`${styles.noramlFlex}`}>
                <div className={`${active > 1 ? `${styles.cart_button} !bg-[#143F6B]` : `${styles.cart_button} !bg-[#abc4dc]`}`}>
                    <span className={`${active > 1 ? `${styles.cart_button_text}` : `${styles.cart_button_text} !text-[#ffff]`}`}>
                    2.Paiement
                    </span>
                </div>
               </div>

               <div className={`${styles.noramlFlex}`}>
               <div className={`${
                    active > 3 ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#143F6B]"
                    : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#abc4dc]"
                }`} />
                <div className={`${active > 2 ? `${styles.cart_button}  !bg-[#143F6B]` : `${styles.cart_button} !bg-[#abc4dc]`}`}>
                    <span className={`${active > 2 ? `${styles.cart_button_text}` : `${styles.cart_button_text} !text-[#ffff]`}`}>
                    3.Succès
                    </span>
                </div>
               </div>
        </div>
    </div>
  )
}

export default CheckoutSteps