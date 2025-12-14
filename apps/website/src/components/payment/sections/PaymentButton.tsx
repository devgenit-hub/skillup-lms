import React from 'react';
import Image from 'next/image';
import { PaymentMethodProps } from '../types/PaymentMethodProps';
import { Circle, CircleCheck } from 'lucide-react';

interface PaymentButtonGroupProps {
  paymentMethod: PaymentMethodProps[];
  selectedMethod: string;
  onChange: (methodId: string) => void;
}

export default function PaymentButton({
  paymentMethod,
  selectedMethod,
  onChange,
}: PaymentButtonGroupProps) {
  return (
    <div className="flex flex-col justify-start gap-2">
      {paymentMethod.map((method) => (
        <label
          key={method.id}
          htmlFor={method.id}
          className={`
            flex bg-gray-700 items-center justify-start gap-2 w-full px-5 py-3 rounded-full cursor-pointer transition
          `}
          style={{ backgroundColor: method.bgColor }}
        >
          {/* Custom radio */}
          <div className="flex items-center gap-3">
            {selectedMethod === method.id ? (
              <CircleCheck size={18} color="#23aa00" fill="#fff" />
            ) : (
              <Circle size={18} className="text-white" />
            )}
            <input
              type="radio"
              id={method.id}
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onChange(method.id)}
              className={`hidden ${method.inputStyle}`}
            />
          </div>
          <span
            className="text-sm font-semibold flex items-center gap-2 text-white"
            style={{ color: method.textColor }}
          >
            Pay with
            <Image
              src={method.logo}
              alt={`${method.title} logo`}
              width={method.width || 24}
              height={method.height || 24}
              className="object-contain"
            />
          </span>
        </label>
      ))}
    </div>
  );
}
