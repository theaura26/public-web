import { OneCol, TwoCol, SpecTable } from '@/components/article/Article'
import Reveal from '@/components/RevealOnScroll'

/* Privacy.
 *
 * A functional policy, in the order these documents are normally
 * written: what is collected, why, who it goes to, how long it is kept,
 * and what you can ask for. Plain register rather than the site's
 * editorial voice — someone reading this wants an answer, not prose.
 *
 * Every factual statement is read out of the code that ships:
 * app/providers.tsx for analytics, app/api/ask-aura/route.ts and
 * lib/ask-aura/privacy.ts for the assistant. If either changes, this
 * page changes with it.
 */

const UPDATED = '31 August 2026'

export default function PrivacyPage() {
  return (
    <main>
      <section style={{ paddingTop: 'calc(var(--nav-h) + var(--head-top))', paddingBottom: 'var(--head-bottom)' }}>
        <div className="section-w">
          <Reveal>
            <h1 style={{ maxWidth: 900 }}>Privacy Policy</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="p1" style={{ maxWidth: '46ch', marginTop: 'var(--space-5)' }}>
              How this website handles your data. Last updated {UPDATED}.
            </p>
          </Reveal>
        </div>
      </section>

      <TwoCol id="summary" heading="Summary">
        <p className="p1">
          You can read this site without giving us any personal information. There are no
          accounts, and we do not sell or share data with advertisers.
        </p>
        <p className="p1">
          Two things collect data: analytics, which measures how the site is used, and Ask
          Aura, which sends your question to OpenAI to generate an answer. Both are described
          below.
        </p>
      </TwoCol>

      <TwoCol id="who" heading="Who we are">
        <p className="p1">
          This site is operated by Aura. For any privacy question, or to make any of the
          requests described below, write to{' '}
          <a href="mailto:hello@theaura.life">hello@theaura.life</a>.
        </p>
      </TwoCol>

      <SpecTable
        title="What we collect"
        rows={[
          { label: 'Usage data', value: 'Pages visited, clicks, and errors — collected automatically by analytics' },
          { label: 'Session recordings', value: 'A replay of your visit. All form and text inputs are masked' },
          { label: 'Device data', value: 'Browser type, screen size, approximate location from IP, and referring page' },
          { label: 'Assistant questions', value: 'The text of questions you type into Ask Aura' },
          { label: 'Email', value: 'Your name, address and message, if you contact us' },
        ]}
        note="We do not collect payment details, and we do not ask you to create an account."
      />

      <TwoCol id="why" heading="Why we collect it">
        <p className="p1">
          Usage data and session recordings are used to understand which pages are read and to
          find things that are broken. Assistant questions are used to generate an answer and
          to see which topics are being asked about. Email is used to reply to you.
        </p>
        <p className="p1">
          Where the law requires a basis for processing, ours is legitimate interest in
          operating and improving the site, and for email, taking steps at your request.
        </p>
      </TwoCol>

      <TwoCol id="analytics" heading="Analytics">
        <p className="p1">
          We use PostHog, hosted in the European Union. It runs only on the live site. Analytics
          requests are routed through a path on this domain rather than directly to PostHog,
          which means an ad blocker will usually not block them.
        </p>
        <p className="p1">
          PostHog assigns you an identifier so that repeat visits are recognised as the same
          visitor. This site sets no cookies; the identifier is stored in your browser&rsquo;s
          local storage. Clearing site data for this domain removes it.
        </p>
      </TwoCol>

      <TwoCol id="assistant" heading="Ask Aura">
        <p className="p1">
          Ask Aura answers questions about the estate. Your question is sent to OpenAI, together
          with passages from this site, in order to generate an answer. It is not sent with any
          identifier for you.
        </p>
        <p className="p1">
          The text of your question is never sent to analytics. The assistant panel is excluded
          from click tracking and from session recording, so what you type does not appear in a
          replay. Analytics receives only the topic of the question and whether an answer was
          found.
        </p>
        <p className="p1">
          Your conversation history is stored in your browser, not on our servers. Clearing it
          removes it. We count requests per IP address for a short period to limit abuse; that
          count is held in memory and is not stored.
        </p>
      </TwoCol>

      <SpecTable
        title="Who receives your data"
        rows={[
          { label: 'PostHog', value: 'Usage data, session recordings, device data. Hosted in the EU' },
          { label: 'OpenAI', value: 'The text of questions asked through Ask Aura' },
          { label: 'Vercel', value: 'Hosting. Serves the site and processes requests to it' },
          { label: 'Advertisers, brokers', value: 'None. We do not sell or share data for advertising' },
        ]}
        note="These providers act on our instructions and under their own privacy terms. Data may be processed outside your country, including in the United States."
      />

      <TwoCol id="cookies" heading="Cookies and local storage">
        <p className="p1">
          This site sets no cookies. It does store data in your browser&rsquo;s local storage:
          the analytics identifier described above, and your theme and view preferences.
        </p>
        <p className="p1">
          Analytics and session recording currently start when the page loads, without asking
          you first. Some jurisdictions treat local storage the way they treat cookies and
          require consent for this. We have not yet added a consent step. In the meantime,
          clearing site data for this domain removes what is stored, and browser
          &ldquo;do not track&rdquo; settings are not currently acted on.
        </p>
      </TwoCol>

      <TwoCol id="retention" heading="How long we keep it">
        <p className="p1">
          Email is kept for as long as the conversation is useful, and is not added to a
          marketing list.
        </p>
        <p className="p1">
          For analytics data we have not set our own retention period, so it is held under
          PostHog&rsquo;s defaults rather than a period we chose. When we set one, it will be
          stated here.
        </p>
      </TwoCol>

      <TwoCol id="rights" heading="Your rights">
        <p className="p1">
          Depending on where you live, you may have the right to access the data we hold about
          you, to have it corrected or deleted, to object to or restrict how it is used, and to
          receive a copy of it. You also have the right to complain to your local data
          protection authority.
        </p>
        <p className="p1">
          To make any of these requests, email{' '}
          <a href="mailto:hello@theaura.life">hello@theaura.life</a> and say what you want. There
          is no form and no account to close. We will respond within one month.
        </p>
      </TwoCol>

      <TwoCol id="children" heading="Children">
        <p className="p1">
          This site is not directed at children and we do not knowingly collect data from
          anyone under 16. If you believe we have, write to us and we will delete it.
        </p>
      </TwoCol>

      <OneCol id="changes" heading="Changes to this policy">
        <p className="p1">
          We update this page when what it describes changes. The date at the top shows when it
          was last updated. There is no notification and no archive of previous versions.
        </p>
        <p className="p1">
          Questions: <a href="mailto:hello@theaura.life">hello@theaura.life</a>.
        </p>
      </OneCol>
    </main>
  )
}
