/**
 * Primary author: Tobias Buschor (https://stackoverflow.com/a/61110260)
 *
 * Secondary authors: lingziyb & TechQuery
 */

export type ButtonElement = HTMLInputElement | HTMLButtonElement;

export const SubmitableButton =
  'button, input[type="button"], input[type="submit"], input[type="image"]';

var last_buttons: ButtonElement[] = [];

function capturer(event: KeyboardEvent | MouseEvent) {
  const button =
    event.target instanceof Element &&
    event.target.closest<ButtonElement>(SubmitableButton);

  if (
    button &&
    button.form &&
    (event instanceof MouseEvent || event.key === 'Enter' || event.key === ' ')
  )
    last_buttons.push(button);
}

function definer(event: Event) {
  const submitter = last_buttons.find(button => button.form === event.target);

  if (submitter)
    last_buttons = last_buttons.filter(button => button !== submitter);

  Object.defineProperty(event, 'submitter', {
    configurable: true,
    enumerable: true,
    get: () => submitter || null
  });
}

if (typeof document !== 'undefined' && typeof SubmitEvent !== 'function') {
  const { preventDefault } = Event.prototype;

  Event.prototype.preventDefault = function () {
    if (this instanceof KeyboardEvent || this instanceof MouseEvent) {
      const submitter = (this.target as Element).closest(SubmitableButton);
      last_buttons = last_buttons.filter(button => button !== submitter);
    }
    return preventDefault.call(this);
  };

  document.addEventListener('click', capturer, true);
  document.addEventListener('keyup', capturer, true);
  document.addEventListener('submit', definer, true);
}
