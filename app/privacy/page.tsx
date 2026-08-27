import { OneCol, TwoCol, SpecTable } from '@/components/article/Article'
import Reveal from '@/components/RevealOnScroll'

/* Privacy.
 *
 * Written the way the rest of the site is written: say what is true,
 * publish the edge of it, and do not dress an unresolved question as a
 * settled one. Every statement here was read out of the code that ships
 * — app/providers.tsx for analytics, lib/ask-aura/privacy.ts and
 * app/api/ask-aura/route.ts for the assistant — rather than out of a
 * template. Where a decision has not been made, the page says so.
 *
 * It uses the journal kit and no components of its own.
 */

export default function PrivacyPage() {
  return (
    <main>
      <section style={{ paddingTop: 'calc(var(--nav-h) + var(--head-top))', paddingBottom: 'var(--head-bottom)' }}>
        <div className="section-w">
          <Reveal>
            <h1 style={{ maxWidth: 900 }}>Privacy.</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="p1" style={{ maxWidth: '46ch', marginTop: 'var(--space-5)' }}>
              What this site collects, what leaves it, and what Aura keeps. An estate that
              publishes its soil tests should be willing to publish this too.
            </p>
          </Reveal>
        </div>
      </section>

      <TwoCol id="short" heading="The short version.">
        <p className="p1">
          You can read every page here without telling us anything. Nothing on this site asks
          you to make an account, and nothing is sold to anyone.
        </p>
        <p className="p1">
          Two things do collect data. Analytics, which measures how the site is used. And Ask
          Aura, the assistant, which sends your question to a model run by OpenAI in order to
          answer it. Both are described below in the detail they deserve.
        </p>
      </TwoCol>

      <TwoCol id="analytics" heading="Analytics.">
        <p className="p1">
          The site uses PostHog. It runs only on the live site — a developer working locally
          sends nothing. Requests go through a path on this domain rather than straight to
          PostHog, so an ad blocker will usually not see them; that is a reliability choice, and
          it is fair that you know about it.
        </p>
      </TwoCol>

      <SpecTable
        title="What analytics records"
        rows={[
          { label: 'Pages', value: 'Every page you visit, and whether you read the human or the agent view' },
          { label: 'Clicks', value: 'Interactions across the site, captured automatically' },
          { label: 'Session replay', value: 'A recording of your visit, with every form field masked' },
          { label: 'Errors', value: 'What the site throws, so it can be fixed' },
          { label: 'A profile', value: 'Held in a cookie and in local storage, linking your visits together' },
        ]}
        note="The profile is the row worth pausing on: it means return visits are recognised as the same visitor. Clearing your browser's cookies and site data for this domain ends that, and a browser set to block third-party storage will limit it further."
      />

      <TwoCol id="ask" heading="Ask Aura.">
        <p className="p1">
          The assistant answers questions about the estate. To do that, your question is sent to
          OpenAI, which runs the model that writes the answer. It travels with a set of passages
          from this site and nothing about you.
        </p>
        <p className="p1">
          Your question is never sent to analytics. That is a deliberate piece of engineering
          rather than a promise: a free-text box collects whatever a person types, including the
          things you asked them not to type, and no filter can prove a string is clean. So no
          free text leaves that module at all. What is recorded instead is the shape of the
          question — its topic, whether an answer was found — and the panel itself is excluded
          from click capture and from session recording, so your typing is not in the replay
          either.
        </p>
        <p className="p1">
          The conversation you can see in the panel is held in your own browser, not on a server.
          Clearing it clears it. To limit abuse, the number of questions from one address is
          counted for a short period; that count lives in memory and disappears when the server
          restarts.
        </p>
      </TwoCol>

      <SpecTable
        title="What goes where"
        rows={[
          { label: 'Pages, clicks, replays', value: 'PostHog' },
          { label: 'Your question to the assistant', value: 'OpenAI' },
          { label: 'The topic of your question', value: 'PostHog, without the text' },
          { label: 'Your conversation history', value: 'Your browser only' },
          { label: 'Anything at all', value: 'Never sold, never brokered' },
        ]}
        note="Both are processors acting on Aura's instructions. Each keeps its own privacy terms, and this page does not override them."
      />

      <TwoCol id="email" heading="If you write to us.">
        <p className="p1">
          The contact form and the address on this site reach a mailbox Aura reads. What you send
          is kept as long as the conversation is useful and is not added to a marketing list. If
          you would like it deleted, ask, and it will be.
        </p>
      </TwoCol>

      <TwoCol id="rights" heading="What you can ask for.">
        <p className="p1">
          You can ask what is held about you, ask for it to be corrected, ask for it to be
          deleted, and object to it being collected at all. Write to{' '}
          <a href="mailto:hello@theaura.life">hello@theaura.life</a> and say which. There is no
          form to fill in and no account to close.
        </p>
        <p className="p1">
          Depending on where you live, some of those are rights rather than courtesies. Aura
          treats them the same way either way.
        </p>
      </TwoCol>

      <OneCol id="unsettled" heading="What is not settled yet.">
        <p className="p1">
          Two things on this page are honest gaps rather than decisions, and it is better to
          publish them than to write around them.
        </p>
        <p className="p1">
          <strong>How long analytics data is kept.</strong> Aura has not set a retention period.
          Until it does, the data sits under the analytics provider&rsquo;s own default, which is
          not a period Aura chose. A period will be set and stated here.
        </p>
        <p className="p1">
          <strong>Consent for non-essential cookies.</strong> This site sets an analytics cookie
          and records sessions without asking first. Where you are reading from may require it to
          ask. That is being resolved, and until it is, the paragraph above tells you how to opt
          out by hand.
        </p>
      </OneCol>

      <TwoCol id="changes" heading="Changes.">
        <p className="p1">
          When this page changes, it changes here. There is no notification and no version
          history — the current text is what is true today, which is the same standard the rest
          of the site is held to.
        </p>
        <p className="p1">
          Questions about any of it: <a href="mailto:hello@theaura.life">hello@theaura.life</a>.
        </p>
      </TwoCol>
    </main>
  )
}
