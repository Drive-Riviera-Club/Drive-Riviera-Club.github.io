import { MapPin, Search, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  createFreeTextPlace,
  createSelectedTransferPlace,
  geoapifyAttribution,
  geoapifyBias,
  hasGeoapifyKey,
  searchGeoapifyAutocomplete,
} from '../../lib/maps';
import type { SelectedPlace, TransferLocationValue } from '../../types';

interface PlaceAutocompleteProps {
  label: string;
  placeholder: string;
  value: TransferLocationValue | null;
  onPlaceSelect: (value: TransferLocationValue | null) => void;
  required?: boolean;
  error?: string;
  locationBias?: { latitude: number; longitude: number; radius: number };
  disabled?: boolean;
}

export function PlaceAutocomplete({
  label,
  placeholder,
  value,
  onPlaceSelect,
  required,
  error,
  locationBias,
  disabled,
}: PlaceAutocompleteProps) {
  const id = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasApiKey = useMemo(() => hasGeoapifyKey(), []);
  const [inputText, setInputText] = useState(value?.formattedAddress ?? '');
  const [suggestions, setSuggestions] = useState<SelectedPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!hasApiKey) {
      return;
    }

    const trimmed = inputText.trim();
    if (trimmed.length < 3) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setStatusMessage('');
      const result = await searchGeoapifyAutocomplete(trimmed, controller.signal, locationBias || geoapifyBias);
      if (controller.signal.aborted) return;

      setLoading(false);
      setSuggestions(result.suggestions);
      setStatusMessage(result.error || (result.suggestions.length ? '' : 'No encontramos resultados.'));
      setOpen(true);
      setActiveIndex(result.suggestions.length ? 0 : -1);

      if (!result.error && result.suggestions.length === 0) {
        onPlaceSelect(createFreeTextPlace(trimmed));
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [hasApiKey, inputText, locationBias, onPlaceSelect]);

  const selectSuggestion = (place: SelectedPlace) => {
    const selectedPlace = createSelectedTransferPlace(place);
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
    setStatusMessage('');
    setInputText(selectedPlace.formattedAddress);
    onPlaceSelect(selectedPlace);
    inputRef.current?.focus();
  };

  const handleInputChange = (nextValue: string) => {
    setInputText(nextValue);

    if (!nextValue.trim()) {
      setSuggestions([]);
      setLoading(false);
      setOpen(false);
      setStatusMessage('');
      onPlaceSelect(null);
      return;
    }

    if (!hasApiKey) {
      onPlaceSelect(createFreeTextPlace(nextValue));
      return;
    }

    if (value?.selectedFromSuggestions) {
      onPlaceSelect(null);
    }

    if (nextValue.trim().length < 3) {
      setSuggestions([]);
      setLoading(false);
      setStatusMessage('');
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    setOpen(true);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (hasApiKey && open && suggestions.length && event.key === 'Tab' && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
      return;
    }

    if (!hasApiKey || !open || !suggestions.length) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required ? '*' : ''}
      </label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest" />
        <input
          ref={inputRef}
          id={id}
          disabled={disabled}
          value={inputText}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => {
            if (hasApiKey && suggestions.length && inputText.trim().length >= 3) {
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full rounded-2xl border bg-white py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-forest focus:ring-2 focus:ring-forest/15 ${
            error ? 'border-rose-400' : 'border-sand'
          } ${value?.selectedFromSuggestions ? 'bg-forest/5' : ''}`}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-invalid={Boolean(error)}
        />
        {inputText ? (
          <button
            type="button"
            onClick={() => {
              setSuggestions([]);
              setOpen(false);
              setActiveIndex(-1);
              setStatusMessage('');
              setInputText('');
              onPlaceSelect(null);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 transition hover:bg-sand/40 hover:text-navy"
            aria-label="Limpiar ubicacion"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
      </div>

      {hasApiKey ? (
        <p className="mt-1 text-[11px] text-slate-500">{geoapifyAttribution}</p>
      ) : null}

      {loading && inputText.trim().length >= 3 ? <p className="mt-2 text-xs text-slate-500">Buscando ubicaciones...</p> : null}
      {statusMessage && inputText.trim().length >= 3 ? <p className="mt-2 text-xs text-slate-500">{statusMessage}</p> : null}
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
      {!hasApiKey ? <p className="mt-2 text-xs text-slate-500">La ubicación será validada y confirmada por WhatsApp.</p> : null}

      {hasApiKey && open && inputText.trim().length >= 3 && suggestions.length > 0 ? (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-sand bg-white shadow-card">
          <ul id={`${id}-listbox`} role="listbox" className="py-2">
            {suggestions.map((suggestion, index) => {
              const active = index === activeIndex;
              return (
                <li key={`${suggestion.placeId}-${index}`} role="option" aria-selected={active}>
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left transition ${active ? 'bg-forest/10' : 'hover:bg-cream'}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    <span className="block text-sm font-semibold text-navy">{suggestion.displayName}</span>
                    <span className="mt-1 block text-xs text-slate-500">{suggestion.formattedAddress}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
