import type { InquiryMode, Property } from '../../data/types';
import { InquiryForm } from '../forms/InquiryForm';
import { Modal } from '../ui/Modal';
import { formatPrice } from '../../data/properties';

type InquiryModalProps = {
  open: boolean;
  mode: InquiryMode;
  property?: Property;
  onClose: () => void;
};

export function InquiryModal({ open, mode, property, onClose }: InquiryModalProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="inquiry-title">
      <span className="eyebrow">{mode === 'viewing' ? 'تعیین وقت بازدید' : 'تماس با مشاور'}</span>
      <h2 id="inquiry-title" className="inquiry-modal__title">
        {property ? property.name : mode === 'viewing' ? 'رزرو بازدید خصوصی' : 'گفت‌وگو با مشاور'}
      </h2>
      {property ? (
        <p className="inquiry-modal__sub">
          {formatPrice(property.price)} · {property.city}، {property.region}
        </p>
      ) : (
        <p className="inquiry-modal__sub">بگویید دنبال چه هستید؛ یک مشاور شخصاً پاسخ می‌دهد.</p>
      )}
      <InquiryForm mode={mode} property={property} onDone={onClose} />
    </Modal>
  );
}
