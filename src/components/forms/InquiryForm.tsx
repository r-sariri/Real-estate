import { useState } from 'react';
import { submitInquiry } from '../../data/repository';
import type { InquiryMode, Property } from '../../data/types';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import './InquiryForm.css';

type InquiryFormProps = {
  mode: InquiryMode;
  property?: Property;
  onDone?: () => void;
  submitLabel?: string;
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  time: string;
};

const EMPTY: FormValues = { name: '', email: '', phone: '', message: '', date: '', time: '' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InquiryForm({ mode, property, onDone, submitLabel }: InquiryFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');

  function update(key: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) next.name = 'Please add your name.';
    if (!EMAIL_RE.test(values.email.trim())) next.email = 'Please add a valid email address.';
    if (mode === 'viewing' && !values.date) next.date = 'Choose a preferred date.';
    if (mode === 'viewing' && !values.time) next.time = 'Choose a preferred time.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus('sending');
    await submitInquiry({
      mode,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
      propertySlug: property?.slug,
      propertyName: property?.name,
      preferredDate: values.date || undefined,
      preferredTime: values.time || undefined,
    });
    setStatus('done');
  }

  if (status === 'done') {
    const firstName = values.name.trim().split(' ')[0];
    return (
      <div className="inquiry-success" role="status">
        <span className="inquiry-success__icon">
          <Icon name="check" size={22} strokeWidth={1.8} />
        </span>
        <h3 className="inquiry-success__title">Thank you{firstName ? `, ${firstName}` : ''}.</h3>
        <p className="inquiry-success__text">
          {mode === 'viewing'
            ? `Your viewing request has been received${property ? ` for ${property.name}` : ''}. An advisor will confirm the time with you shortly.`
            : `Your message has been received${property ? ` about ${property.name}` : ''}. An advisor will be in touch within one business day.`}
        </p>
        {onDone ? (
          <Button variant="primary" onClick={onDone} icon={null}>
            Done
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor={`${mode}-name`}>
          Full name
        </label>
        <input
          id={`${mode}-name`}
          className="input"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(event) => update('name', event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${mode}-name-error` : undefined}
          required
        />
        {errors.name ? (
          <p id={`${mode}-name-error`} className="field__error">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${mode}-email`}>
          Email
        </label>
        <input
          id={`${mode}-email`}
          className="input"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => update('email', event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${mode}-email-error` : undefined}
          required
        />
        {errors.email ? (
          <p id={`${mode}-email-error`} className="field__error">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="field inquiry-form__full">
        <label className="field__label" htmlFor={`${mode}-phone`}>
          Phone <span aria-hidden="true">(optional)</span>
        </label>
        <input
          id={`${mode}-phone`}
          className="input"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) => update('phone', event.target.value)}
        />
      </div>

      {mode === 'viewing' ? (
        <>
          <div className="field">
            <label className="field__label" htmlFor="viewing-date">
              Preferred date
            </label>
            <input
              id="viewing-date"
              className="input"
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={values.date}
              onChange={(event) => update('date', event.target.value)}
              aria-invalid={Boolean(errors.date)}
              aria-describedby={errors.date ? 'viewing-date-error' : undefined}
              required
            />
            {errors.date ? (
              <p id="viewing-date-error" className="field__error">
                {errors.date}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="viewing-time">
              Preferred time
            </label>
            <select
              id="viewing-time"
              className="select"
              value={values.time}
              onChange={(event) => update('time', event.target.value)}
              aria-invalid={Boolean(errors.time)}
              aria-describedby={errors.time ? 'viewing-time-error' : undefined}
              required
            >
              <option value="">Select a window</option>
              <option value="morning">Morning, 9–12</option>
              <option value="afternoon">Afternoon, 12–4</option>
              <option value="evening">Evening, 4–7</option>
            </select>
            {errors.time ? (
              <p id="viewing-time-error" className="field__error">
                {errors.time}
              </p>
            ) : null}
          </div>
        </>
      ) : null}

      <div className="field inquiry-form__full">
        <label className="field__label" htmlFor={`${mode}-message`}>
          Message <span aria-hidden="true">(optional)</span>
        </label>
        <textarea
          id={`${mode}-message`}
          className="textarea"
          rows={3}
          value={values.message}
          onChange={(event) => update('message', event.target.value)}
          placeholder={
            mode === 'viewing'
              ? 'Anything we should prepare for your visit?'
              : 'Tell us what you are looking for.'
          }
        />
      </div>

      <div className="inquiry-form__full">
        <Button type="submit" variant="primary" block disabled={status === 'sending'} icon="arrow-right">
          {status === 'sending' ? 'Sending…' : (submitLabel ?? (mode === 'viewing' ? 'Request Viewing' : 'Send Message'))}
        </Button>
        <p className="inquiry-form__note">
          By submitting, you agree to be contacted by Horizon Properties about this enquiry. We never share your
          details.
        </p>
      </div>
    </form>
  );
}
