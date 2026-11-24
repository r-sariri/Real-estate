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
    if (!values.name.trim()) next.name = 'لطفاً نام خود را وارد کنید.';
    if (!EMAIL_RE.test(values.email.trim())) next.email = 'لطفاً یک نشانی ایمیل معتبر وارد کنید.';
    if (mode === 'viewing' && !values.date) next.date = 'تاریخ موردنظر را انتخاب کنید.';
    if (mode === 'viewing' && !values.time) next.time = 'زمان موردنظر را انتخاب کنید.';
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
        <h3 className="inquiry-success__title">سپاس{firstName ? `، ${firstName}` : ''}.</h3>
        <p className="inquiry-success__text">
          {mode === 'viewing'
            ? `درخواست بازدید شما ثبت شد${property ? ` برای ${property.name}` : ''}. یک مشاور به‌زودی زمان را با شما هماهنگ می‌کند.`
            : `پیام شما دریافت شد${property ? ` درباره ${property.name}` : ''}. یک مشاور حداکثر تا یک روز کاری با شما تماس می‌گیرد.`}
        </p>
        {onDone ? (
          <Button variant="primary" onClick={onDone} icon={null}>
            بستن
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor={`${mode}-name`}>
          نام و نام خانوادگی
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
          ایمیل
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
          تلفن <span aria-hidden="true">(اختیاری)</span>
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
              تاریخ موردنظر
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
              زمان موردنظر
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
              <option value="">یک بازه را انتخاب کنید</option>
              <option value="morning">صبح، ۹ تا ۱۲</option>
              <option value="afternoon">بعدازظهر، ۱۲ تا ۱۶</option>
              <option value="evening">عصر، ۱۶ تا ۱۹</option>
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
          پیام <span aria-hidden="true">(اختیاری)</span>
        </label>
        <textarea
          id={`${mode}-message`}
          className="textarea"
          rows={3}
          value={values.message}
          onChange={(event) => update('message', event.target.value)}
          placeholder={
            mode === 'viewing'
              ? 'چیزی هست که برای بازدید شما آماده کنیم؟'
              : 'بگویید دنبال چه هستید.'
          }
        />
      </div>

      <div className="inquiry-form__full">
        <Button type="submit" variant="primary" block disabled={status === 'sending'} icon="arrow-right">
          {status === 'sending' ? 'در حال ارسال…' : (submitLabel ?? (mode === 'viewing' ? 'درخواست بازدید' : 'ارسال پیام'))}
        </Button>
        <p className="inquiry-form__note">
          با ارسال این فرم، با تماس املاک افق درباره این درخواست موافقت می‌کنید. اطلاعات شما هرگز در اختیار
          دیگران قرار نمی‌گیرد.
        </p>
      </div>
    </form>
  );
}
