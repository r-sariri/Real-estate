import { Img } from '../ui/Img';
import { Reveal } from '../ui/Reveal';
import './WhyChoose.css';

const reasons = [
  {
    title: 'مشاوره پیش از فهرست',
    text: 'با تصمیم شروع می‌کنیم، نه با موجودی — ارزش‌گذاری، تأمین مالی و زمان‌بندی در اولویت‌اند.'
  },
  {
    title: 'شبکه‌ای خصوصی و گزیده',
    text: 'بخش قابل‌توجهی از خانه‌هایی که نمایندگی می‌کنیم، پیش از ورود به بازار آزاد معرفی می‌شوند.'
  },
  {
    title: 'یک نقطه تماس',
    text: 'مشاور شما از نخستین گفت‌وگو تا تحویل کلید — و سال‌ها پس از آن — همراهتان می‌ماند.'
  },
];

const stats = [
  { value: '۱۸', label: 'سال تجربه' },
  { value: '۴٫۲ میلیارد دلار', label: 'حجم معاملات ملکی' },
  { value: '+۴۸۰', label: 'خانه واگذارشده' },
  { value: '۹۷٪', label: 'مشتریان از طریق معرفی' },
];

export function WhyChoose() {
  return (
    <section className="section section--sand why" aria-labelledby="why-title">
      <div className="container why__grid">
        <Reveal className="why__media">
          <figure className="why__figure">
            <Img
              id="1613977257363-707ba9348227"
              alt="ویلای معاصر با استخر آینه‌ای و باغ کهن"
              sizes="(max-width: 900px) 92vw, 40vw"
            />
          </figure>
          <figcaption className="why__caption">اقامتگاه دریاچه آستین · تکمیل ۲۰۲۱</figcaption>
        </Reveal>

        <Reveal delay={120} className="why__copy">
          <span className="eyebrow">چرا افق</span>
          <h2 id="why-title" className="section-title why__title">
            مشاوره سنجیده، <em>ارزش پایدار.</em>
          </h2>
          <blockquote className="why__quote">
            «با هر خانه مانند یک میراث معماری رفتار می‌کنیم — و با هر مشتری مانند یک شریک بلندمدت.»
          </blockquote>
          <ol className="why__list">
            {reasons.map((reason, index) => (
              <li key={reason.title} className="why__item">
                <span className="why__item-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="why__item-title">{reason.title}</h3>
                  <p className="why__item-text">{reason.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      <div className="container">
        <dl className="why__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="why__stat">
              <dt className="why__stat-label">{stat.label}</dt>
              <dd className="why__stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
