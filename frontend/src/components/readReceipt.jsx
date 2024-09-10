import { MdError, MdOutlineScheduleSend } from "react-icons/md";
import { BsSendCheckFill } from "react-icons/bs";
import { IoMdRefresh } from "react-icons/io";
import Button from "./button";

export default function ReadReceipt({ status, sendAt, onResend }) {
  const failedToSend = () => {
    if (sendAt) return (new Date(Date.now()) - new Date(sendAt)) / 1000 >= 10;

    return false;
  };

  if (status)
    return (
      <span className="read-receipt">
        <BsSendCheckFill title={status} className={status} />
      </span>
    );

  if (failedToSend()) {
    return (
      <span className="read-receipt">
        {onResend ? (
          <Button onClick={onResend}>
            <IoMdRefresh
              title="Failed to send, Click to resend"
              className="failed resend"
            />
          </Button>
        ) : (
          <MdError title="Failed to send" className="failed" />
        )}
      </span>
    );
  }

  return (
    <span className="read-receipt">
      <MdOutlineScheduleSend title="Sending..." className="sending" />
    </span>
  );
}
