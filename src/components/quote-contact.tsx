"use client";

import { useEffect, useRef, useState } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { sendToInbox } from "@/lib/inbox/client";
import { STAAT_NL } from "@/lib/inbox/types";
import { DayPicker } from "react-day-picker";
import { de, enGB, es, fr, it, nl } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { asset } from "@/lib/asset";

const inputClass =
  "w-full rounded-xl bg-white px-4 py-3 text-sm text-zinc-950 ring-1 ring-zinc-200 transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-950 focus:outline-none";
const labelClass = "mb-2 block text-sm font-medium text-zinc-600";

const steps = ["transport", "vehicles", "details"] as const;

const DAY_PICKER_LOCALES = { nl, fr, en: enGB, de, es, it } as const;

// Option values are message keys.
const TOESTANDEN = ["runs", "rolls", "blocked"];

function useOutsideClose(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [onClose]);
  return ref;
}

/* Address field with live suggestions from OpenStreetMap (Photon) */
function AddressInput({
  id,
  label,
  value,
  onChange,
  required,
  disabled,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  hint?: React.ReactNode;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const boxRef = useOutsideClose(() => setOpen(false));

  const search = (q: string) => {
    clearTimeout(timer.current);
    if (q.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5`
        );
        const json = await res.json();
        const opts = (json.features ?? []).map(
          (f: {
            properties: {
              name?: string;
              housenumber?: string;
              street?: string;
              postcode?: string;
              city?: string;
              country?: string;
            };
          }) => {
            const p = f.properties;
            const line1 = [p.street ?? p.name, p.housenumber]
              .filter(Boolean)
              .join(" ");
            const line2 = [p.postcode, p.city].filter(Boolean).join(" ");
            return [line1, line2, p.country].filter(Boolean).join(", ");
          }
        );
        const unique = [...new Set(opts as string[])].slice(0, 5);
        setSuggestions(unique);
        setOpen(unique.length > 0);
      } catch {
        // suggestions are best-effort; typing plain text keeps working
      }
    }, 300);
  };

  return (
    <div ref={boxRef} className="relative">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        value={value}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          search(e.target.value);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        className={`${inputClass} disabled:opacity-50`}
      />
      {open && (
        <ul className="absolute inset-x-0 z-30 mt-2 overflow-hidden rounded-xl bg-white py-1 shadow-xl ring-1 ring-zinc-200">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
      {hint}
    </div>
  );
}

/* Input-styled button that opens a calendar */
function DateField({
  label,
  date,
  onSelect,
  disabled,
  invalid,
  optional,
}: {
  label: string;
  date: Date | undefined;
  onSelect: (d: Date | undefined) => void;
  disabled?: boolean;
  invalid?: boolean;
  optional?: boolean;
}) {
  const t = useTranslations("QuoteContact");
  const locale = useLocale();
  const format = useFormatter();
  const [open, setOpen] = useState(false);
  const boxRef = useOutsideClose(() => setOpen(false));

  return (
    <div ref={boxRef} className="relative">
      <span className={labelClass}>
        {label} {optional && <span className="text-zinc-400">{t("optional")}</span>}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`${inputClass} flex cursor-pointer items-center justify-between gap-3 text-left disabled:opacity-50 ${
          invalid ? "ring-red-500/60" : ""
        }`}
      >
        <span className={date ? "" : "text-zinc-400"}>
          {date
            ? format.dateTime(date, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : t("pickDate")}
        </span>
        <svg
          className="size-4 flex-none text-zinc-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
          <path d="M3.5 9.5h17M8 2.8v4M16 2.8v4" />
        </svg>
      </button>
      {invalid && (
        <p className="mt-2 text-xs text-red-500">
          {t("dateInvalid")}
        </p>
      )}
      {open && (
        <div className="absolute z-30 mt-2 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-zinc-200">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(d) => {
              onSelect(d);
              setOpen(false);
            }}
            locale={DAY_PICKER_LOCALES[locale as keyof typeof DAY_PICKER_LOCALES] ?? nl}
            disabled={{ before: new Date() }}
            className="rdp-light"
          />
        </div>
      )}
    </div>
  );
}

/* Custom light select */
function NiceSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useOutsideClose(() => setOpen(false));

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`${inputClass} flex cursor-pointer items-center justify-between gap-2 text-left`}
      >
        <span className="truncate">{options.find((o) => o.value === value)?.label ?? value}</span>
        <svg
          className={`size-4 flex-none text-zinc-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul className="absolute inset-x-0 z-30 mt-2 overflow-hidden rounded-xl bg-white py-1 shadow-xl ring-1 ring-zinc-200">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-zinc-100 ${
                  option.value === value ? "text-zinc-950" : "text-zinc-600"
                }`}
              >
                {option.label}
                {option.value === value && (
                  <svg
                    className="size-4 flex-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 12.5l5 5 10-11" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function QuoteContact() {
  const t = useTranslations("QuoteContact");
  const ti = useTranslations("Inbox");
  const [stored, setStored] = useState(false);
  const [busy, setBusy] = useState(false);
  const format = useFormatter();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<"particulier" | "bedrijf">("particulier");
  const [depot, setDepot] = useState(false);
  const [asap, setAsap] = useState(false);
  const [ophaal, setOphaal] = useState("");
  const [lever, setLever] = useState("");
  const [ophaalDate, setOphaalDate] = useState<Date | undefined>(undefined);
  const [leverDate, setLeverDate] = useState<Date | undefined>(undefined);
  const [dateInvalid, setDateInvalid] = useState(false);
  const [vehicleIds, setVehicleIds] = useState([0]);
  const [toestanden, setToestanden] = useState<Record<number, string>>({
    0: TOESTANDEN[0],
  });
  const nextVehicleId = useRef(1);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const addVehicle = () => {
    const id = nextVehicleId.current++;
    setVehicleIds((ids) => [...ids, id]);
    setToestanden((t) => ({ ...t, [id]: TOESTANDEN[0] }));
  };
  const removeVehicle = (id: number) => {
    setVehicleIds((ids) => ids.filter((v) => v !== id));
  };

  const validateStep = (i: number) => {
    const container = stepRefs.current[i];
    if (!container) return true;
    const fields = container.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea");
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    if (i === 0 && !asap && !ophaalDate) {
      setDateInvalid(true);
      return false;
    }
    setDateInvalid(false);
    return true;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const fmtDate = (d: Date | undefined) =>
    d
      ? format.dateTime(d, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const data = new FormData(e.currentTarget);
    const str = (k: string) => String(data.get(k) ?? "").trim();
    const iso = (d?: Date) =>
      d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : undefined;
    setBusy(true);
    const ok = await sendToInbox({
      kind: "offerte",
      form: "homepage",
      klant: {
        type: type === "bedrijf" ? "Bedrijf" : "Particulier",
        naam: [str("voornaam"), str("achternaam")].filter(Boolean).join(" "),
        email: str("email"),
        telefoon: str("telefoon"),
        ...(type === "bedrijf" ? { bedrijf: str("bedrijf"), btw: str("btw") } : {}),
      },
      bericht: str("opmerking"),
      rit: {
        van: { adres: ophaal, datum: asap ? undefined : iso(ophaalDate), zoSnelMogelijk: asap },
        naar: depot ? { depot: true, datum: iso(leverDate) } : { adres: lever, datum: iso(leverDate) },
        opties: data.get("topbox") ? "Topbox of fietsdrager aanwezig" : undefined,
      },
      autos: vehicleIds.map((id) => ({
        model: str(`voertuig-${id}`),
        staat: STAAT_NL[toestanden[id]],
        aantal: Number(str(`aantal-${id}`)) || 1,
      })),
    });
    setBusy(false);
    if (ok) return setStored(true);
    const vehicles = vehicleIds.map(
      (id, i) =>
        t("mail.vehicleLine", {
          n: i + 1,
          model: String(data.get(`voertuig-${id}`)),
          condition: t(`condition.${toestanden[id]}`),
          qty: String(data.get(`aantal-${id}`)),
        })
    );
    const lines = [
      t("mail.customerType", { value: t(`customerType.${type}`).toLowerCase() }),
      t("mail.name", { first: String(data.get("voornaam")), last: String(data.get("achternaam")) }),
      ...(type === "bedrijf"
        ? [
            t("mail.company", { value: String(data.get("bedrijf")) }),
            t("mail.vat", { value: String(data.get("btw")) }),
          ]
        : []),
      t("mail.email", { value: String(data.get("email")) }),
      t("mail.phone", { value: String(data.get("telefoon")) }),
      ``,
      t("mail.pickup", { value: ophaal }),
      t("mail.delivery", { value: depot ? t("mail.depotAddress") : lever }),
      ``,
      ...vehicles,
      t("mail.topbox", { value: data.get("topbox") ? t("mail.yes") : t("mail.no") }),
      ``,
      t("mail.pickupDate", { value: asap ? t("mail.asap") : fmtDate(ophaalDate) }),
      t("mail.deliveryDate", { value: fmtDate(leverDate) }),
      ``,
      t("mail.remarks", { value: String(data.get("opmerking") || "-") }),
    ];
    const mailto = `mailto:info@mcars.be?subject=${encodeURIComponent(
      t("mail.subject")
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = mailto;
  };

  return (
    <section id="offerte" className="px-0 py-10 sm:py-14">
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950">
        {/* Scenic backdrop */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${asset(`/services/01.jpg`)}), linear-gradient(160deg, #3f3f46, #18181b)`,
            backgroundSize: "cover, cover",
            backgroundPosition: "center, center",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,rgb(9_9_11/0.72),rgb(9_9_11/0.42)_45%,rgb(9_9_11/0.25))]"
        />

        <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16 lg:p-16">
          {/* Left: heading */}
          <div>
            <p className="text-sm font-medium tracking-widest text-zinc-300 uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="mt-5 text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-200">
              {t("intro")}
            </p>
          </div>

          {/* Right: white multistep card */}
          {stored ? (
            <div role="status" className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <p className="text-2xl font-medium tracking-tight text-zinc-950">{ti("sentTitle")}</p>
              <p className="mt-3 text-base leading-relaxed text-zinc-500">{ti("sentBody")}</p>
            </div>
          ) : (
          <form
            onSubmit={onSubmit}
            className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            {/* Step indicator */}
            <div className="mb-7">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium text-zinc-950">{t(`steps.${steps[step]}`)}</p>
                <p className="text-xs text-zinc-400">
                  {t("stepOf", { step: step + 1, total: steps.length })}
                </p>
              </div>
              <div className="mt-3 flex gap-1.5">
                {steps.map((label, i) => (
                  <div
                    key={label}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= step ? "bg-zinc-950" : "bg-zinc-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1 — Transport */}
            <div
              ref={(el) => {
                stepRefs.current[0] = el;
              }}
              className={`flex-col gap-5 ${step === 0 ? "flex" : "hidden"}`}
            >
              <div className="flex gap-2" role="radiogroup" aria-label={t("customerTypeAria")}>
                {(["particulier", "bedrijf"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={type === option}
                    onClick={() => setType(option)}
                    className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:outline-none ${
                      type === option
                        ? "bg-zinc-950 text-white"
                        : "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:text-zinc-950"
                    }`}
                  >
                    {t(`customerType.${option}`)}
                  </button>
                ))}
              </div>
              <AddressInput
                id="ophaal"
                label={t("pickupAddress")}
                value={ophaal}
                onChange={setOphaal}
                required
                placeholder={t("addressPlaceholder")}
              />
              <AddressInput
                id="lever"
                label={t("deliveryAddress")}
                value={lever}
                onChange={setLever}
                required={!depot}
                disabled={depot}
                placeholder={depot ? t("depotPlaceholder") : t("addressPlaceholder")}
                hint={
                  <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-zinc-500">
                    <input
                      type="checkbox"
                      checked={depot}
                      onChange={(e) => setDepot(e.target.checked)}
                      className="size-4 accent-zinc-950"
                    />
                    {t("depotLabel")}
                  </label>
                }
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <DateField
                    label={t("availableForPickup")}
                    date={ophaalDate}
                    onSelect={(d) => {
                      setOphaalDate(d);
                      setDateInvalid(false);
                    }}
                    disabled={asap}
                    invalid={dateInvalid}
                  />
                  <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-zinc-500">
                    <input
                      type="checkbox"
                      checked={asap}
                      onChange={(e) => {
                        setAsap(e.target.checked);
                        if (e.target.checked) setDateInvalid(false);
                      }}
                      className="size-4 accent-zinc-950"
                    />
                    {t("asap")}
                  </label>
                </div>
                <DateField
                  label={t("desiredDelivery")}
                  date={leverDate}
                  onSelect={setLeverDate}
                  optional
                />
              </div>
            </div>

            {/* Step 2 — Vehicles */}
            <div
              ref={(el) => {
                stepRefs.current[1] = el;
              }}
              className={`flex-col gap-4 ${step === 1 ? "flex" : "hidden"}`}
            >
              <div className="hidden grid-cols-[1fr_10rem_4rem_1.25rem] gap-3 sm:grid">
                <span className="text-sm font-medium text-zinc-600">{t("vehicle")}</span>
                <span className="text-sm font-medium text-zinc-600">
                  {t("doesItStart")}
                </span>
                <span className="text-sm font-medium text-zinc-600">{t("quantity")}</span>
                <span />
              </div>
              {vehicleIds.map((id, i) => (
                <div
                  key={id}
                  className="grid gap-3 rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-200 sm:grid-cols-[1fr_10rem_4rem_1.25rem] sm:items-center sm:bg-transparent sm:p-0 sm:ring-0"
                >
                  <input
                    name={`voertuig-${id}`}
                    required
                    placeholder={t("makeModel")}
                    aria-label={t("vehicleMakeModelAria", { n: i + 1 })}
                    className={inputClass}
                  />
                  <NiceSelect
                    value={toestanden[id] ?? TOESTANDEN[0]}
                    onChange={(v) => setToestanden((t) => ({ ...t, [id]: v }))}
                    options={TOESTANDEN.map((c) => ({ value: c, label: t(`condition.${c}`) }))}
                    ariaLabel={t("vehicleStartsAria", { n: i + 1 })}
                  />
                  <input
                    name={`aantal-${id}`}
                    type="number"
                    min={1}
                    defaultValue={1}
                    required
                    aria-label={t("vehicleQuantityAria", { n: i + 1 })}
                    className={inputClass}
                  />
                  {i > 0 ? (
                    <button
                      type="button"
                      onClick={() => removeVehicle(id)}
                      aria-label={t("vehicleRemoveAria", { n: i + 1 })}
                      className="flex size-5 cursor-pointer items-center justify-center justify-self-end rounded-full text-zinc-400 transition-colors hover:text-zinc-950 sm:justify-self-auto"
                    >
                      <svg
                        className="size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  ) : (
                    <span className="hidden sm:block" />
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addVehicle}
                className="flex cursor-pointer items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-medium text-zinc-600 ring-1 ring-zinc-200 transition-colors hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:outline-none"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {t("addVehicle")}
              </button>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-500">
                <input
                  type="checkbox"
                  name="topbox"
                  className="size-4 accent-zinc-950"
                />
                {t("topbox")}
              </label>
            </div>

            {/* Step 3 — Personal info */}
            <div
              ref={(el) => {
                stepRefs.current[2] = el;
              }}
              className={`flex-col gap-5 ${step === 2 ? "flex" : "hidden"}`}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="voornaam" className={labelClass}>
                    {t("firstName")}
                  </label>
                  <input
                    id="voornaam"
                    name="voornaam"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="achternaam" className={labelClass}>
                    {t("lastName")}
                  </label>
                  <input
                    id="achternaam"
                    name="achternaam"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              {type === "bedrijf" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bedrijf" className={labelClass}>
                      {t("company")}
                    </label>
                    <input
                      id="bedrijf"
                      name="bedrijf"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="btw" className={labelClass}>
                      {t("vat")}
                    </label>
                    <input
                      id="btw"
                      name="btw"
                      required
                      placeholder={t("vatPlaceholder")}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    {t("email")}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="telefoon" className={labelClass}>
                    {t("phone")}
                  </label>
                  <input
                    id="telefoon"
                    name="telefoon"
                    type="tel"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="opmerking" className={labelClass}>
                  {t("remarks")} <span className="text-zinc-400">{t("optional")}</span>
                </label>
                <textarea
                  id="opmerking"
                  name="opmerking"
                  rows={3}
                  placeholder={t("remarksPlaceholder")}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-7 flex items-center gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={back}
                  className="cursor-pointer rounded-full px-6 py-3.5 text-sm font-medium text-zinc-500 ring-1 ring-zinc-200 transition-colors hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:outline-none"
                >
                  {t("back")}
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex-1 cursor-pointer rounded-full bg-zinc-950 py-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {t("next")}
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 cursor-pointer rounded-full bg-zinc-950 py-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {t("submit")}
                </button>
              )}
            </div>
          </form>
          )}
        </div>
      </div>
    </section>
  );
}
