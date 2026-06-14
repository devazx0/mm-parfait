export default function CustomOrderPage() {

  return (
    <main className="flex-grow flex flex-col w-full px-container-margin-mobile py-xl gap-xl pt-16 pb-[100px]">
      {/* Header */}
      <section className="text-center flex flex-col gap-sm">
        <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-primary">Create Your Custom Parfait</h1>
        <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto">
          Design the perfect healthy treat for your event. Select your base, fresh fruits, crunchy toppings, and personalized packaging.
        </p>
      </section>

      <form className="grid grid-cols-1 lg:grid-cols-12 gap-lg relative">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/* Step 1: Base */}
          <fieldset className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg shadow-[0px_4px_20px_rgba(26,26,26,0.06)] flex flex-col gap-md">
            <legend className="text-headline-md font-headline-md text-on-surface flex items-center gap-sm mb-sm">
              <span className="material-symbols-outlined text-primary">icecream</span>
              1. Choose Your Base
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <label className="flex items-start gap-md p-md border border-surface-variant rounded-lg cursor-pointer hover:border-primary transition-colors has-[:checked]:border-primary">
                <input defaultChecked name="base" type="radio" value="greek_plain" className="mt-1 accent-primary" />
                <div>
                  <span className="block text-label-md font-label-md text-on-surface">Classic Greek (Plain)</span>
                  <span className="block text-label-sm font-label-sm text-on-surface-variant mt-xs">Rich, creamy, and unsweetened.</span>
                </div>
              </label>
              <label className="flex items-start gap-md p-md border border-surface-variant rounded-lg cursor-pointer hover:border-primary transition-colors has-[:checked]:border-primary">
                <input name="base" type="radio" value="greek_vanilla" className="mt-1 accent-primary" />
                <div>
                  <span className="block text-label-md font-label-md text-on-surface">Vanilla Bean Greek</span>
                  <span className="block text-label-sm font-label-sm text-on-surface-variant mt-xs">Lightly sweetened with real vanilla.</span>
                </div>
              </label>
              <label className="flex items-start gap-md p-md border border-surface-variant rounded-lg cursor-pointer hover:border-primary transition-colors has-[:checked]:border-primary">
                <input name="base" type="radio" value="dairy_free" className="mt-1 accent-primary" />
                <div>
                  <span className="block text-label-md font-label-md text-on-surface">Coconut Alternative</span>
                  <span className="block text-label-sm font-label-sm text-on-surface-variant mt-xs">Dairy-free and perfectly smooth.</span>
                </div>
              </label>
            </div>
          </fieldset>

          {/* Step 2: Fruits & Toppings */}
          <fieldset className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg shadow-[0px_4px_20px_rgba(26,26,26,0.06)] flex flex-col gap-md">
            <legend className="text-headline-md font-headline-md text-on-surface flex items-center gap-sm mb-sm">
              <span className="material-symbols-outlined text-primary">nutrition</span>
              2. Fruits &amp; Toppings
            </legend>
            <div className="flex flex-col gap-sm">
              <h3 className="text-label-md font-label-md text-on-surface">Fresh Fruits (Select up to 3)</h3>
              <div className="flex flex-wrap gap-sm">
                {['Strawberries', 'Blueberries', 'Mango', 'Kiwi'].map((f) => (
                  <label
                    key={f}
                    className="inline-flex items-center gap-sm px-sm py-xs bg-surface-container rounded-full cursor-pointer hover:bg-surface-variant transition-colors border border-transparent has-[:checked]:border-primary has-[:checked]:bg-primary-container has-[:checked]:text-on-primary-container"
                  >
                    <input className="hidden" name="fruits" type="checkbox" value={f.toLowerCase()} />
                    <span className="text-label-sm font-label-sm">{f}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-sm mt-md">
              <h3 className="text-label-md font-label-md text-on-surface">Crunch &amp; Drizzle (Select up to 2)</h3>
              <div className="flex flex-wrap gap-sm">
                {['House Granola', 'Sliced Almonds', 'Wildflower Honey', 'Chia Seeds'].map((t) => (
                  <label
                    key={t}
                    className="inline-flex items-center gap-sm px-sm py-xs bg-surface-container rounded-full cursor-pointer hover:bg-surface-variant transition-colors border border-transparent has-[:checked]:border-primary has-[:checked]:bg-primary-container has-[:checked]:text-on-primary-container"
                  >
                    <input className="hidden" name="toppings" type="checkbox" value={t.toLowerCase().replace(/\s+/g, '_')} />
                    <span className="text-label-sm font-label-sm">{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          {/* Step 3: Packaging */}
          <fieldset className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg shadow-[0px_4px_20px_rgba(26,26,26,0.06)] flex flex-col gap-md">
            <legend className="text-headline-md font-headline-md text-on-surface flex items-center gap-sm mb-sm">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              3. Packaging Requirements
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <label className="flex items-start gap-md p-md border border-surface-variant rounded-lg cursor-pointer hover:border-primary transition-colors has-[:checked]:border-primary">
                <input defaultChecked name="packaging" type="radio" value="standard" className="mt-1 accent-primary" />
                <div>
                  <span className="block text-label-md font-label-md text-on-surface">Standard MM Branding</span>
                  <span className="block text-label-sm font-label-sm text-on-surface-variant mt-xs">Our elegant minimalist cups.</span>
                </div>
              </label>
              <label className="flex items-start gap-md p-md border border-surface-variant rounded-lg cursor-pointer hover:border-primary transition-colors has-[:checked]:border-primary">
                <input name="packaging" type="radio" value="custom" className="mt-1 accent-primary" />
                <div>
                  <span className="block text-label-md font-label-md text-on-surface">Custom Event Stickers</span>
                  <span className="block text-label-sm font-label-sm text-on-surface-variant mt-xs">Provide your logo for a personal touch.</span>
                </div>
              </label>
            </div>
          </fieldset>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg shadow-[0px_4px_20px_rgba(26,26,26,0.06)] flex flex-col gap-md">
            <h2 className="text-headline-md font-headline-md text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">event_note</span>
              Event Details
            </h2>
            <div className="flex flex-col gap-xs">
              <label className="text-label-sm font-label-sm text-on-surface" htmlFor="quantity">Estimated Quantity</label>
              <input
                className="w-full px-md py-sm bg-surface-container-lowest border border-surface-variant rounded-md text-body-md font-body-md focus:outline-none focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-colors"
                id="quantity" min="20" name="quantity" placeholder="Minimum 20" type="number"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-sm font-label-sm text-on-surface" htmlFor="event_date">Event Date</label>
              <input
                className="w-full px-md py-sm bg-surface-container-lowest border border-surface-variant rounded-md text-body-md font-body-md focus:outline-none focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-colors"
                id="event_date" name="event_date" type="date"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-sm font-label-sm text-on-surface" htmlFor="notes">Theme or Special Specifications</label>
              <textarea
                className="w-full px-md py-sm bg-surface-container-lowest border border-surface-variant rounded-md text-body-md font-body-md focus:outline-none focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-colors resize-none"
                id="notes" name="notes" placeholder="E.g., Corporate colors, dietary restrictions..." rows={3}
              />
            </div>
            <div className="border-t border-surface-variant pt-md mt-sm">
              <button
                type="submit"
                className="w-full bg-primary-container text-on-primary shadow-[0px_8px_30px_rgba(26,26,26,0.12)] rounded-md py-md px-lg text-label-md font-label-md font-bold hover:opacity-90 transition-opacity flex justify-center items-center gap-sm"
              >
                Submit Request <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  )
}
