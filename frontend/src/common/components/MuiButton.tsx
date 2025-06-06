
import type { buttonProps } from '../../dataModals/Common';

export default function MuiButton({ variant, btnType, children, handleBtnClick, disable }: buttonProps) {
  return (
    <button className={`${variant === 'outlined' ? 'border-2 border-blue-800' : variant === 'danger' ? 'border-2 border-red-600 text-white bg-red-600' : 'border-2 bg-blue-800 text-white'} px-4 py-2 rounded cursor-pointer`} type={btnType} onClick={handleBtnClick} disabled={disable}>{children}</button>
  );
}
