/**
 * Primary author: Tobias Buschor (https://stackoverflow.com/a/61110260)
 *
 * Secondary authors: lingziyb & TechQuery
 */

export type ButtonElement = HTMLInputElement | HTMLButtonElement;

export const SubmitableButton =
    'button, input[type="button"], input[type="submit"], input[type="image"]';

var last_button: ButtonElement | undefined;

document.addEventListener(
    'click',
    event =>
        (last_button = (event.target as Element).closest?.<ButtonElement>(
            SubmitableButton
        )),
    true
);

document.addEventListener(
    'submit',
    event => {
        if (last_button && event.submitter) return;

        Object.defineProperty(Object.getPrototypeOf(event), 'submitter', {
            configurable: true,
            enumerable: true,
            get(this: SubmitEvent) {
                const form = this.target as HTMLFormElement,
                    canditates = [document.activeElement, last_button];

                for (const control of canditates)
                    if (
                        control?.matches(SubmitableButton) &&
                        form === (control as HTMLButtonElement).form
                    )
                        return control as ButtonElement;

                return form.querySelector<ButtonElement>(SubmitableButton);
            }
        });
    },
    true
);

document.addEventListener('submit', () => (last_button = undefined));
