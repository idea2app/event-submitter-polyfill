/**
 * Primary author: Tobias Buschor (https://stackoverflow.com/a/61110260)
 *
 * Secondary authors: lingziyb & TechQuery
 */

declare global {
    interface Event {
        submitter?: HTMLInputElement | HTMLButtonElement;
    }
}

export const SubmitableButton =
    'button, input[type="button"], input[type="submit"], input[type="image"]';

var last_button: HTMLButtonElement | undefined;

document.addEventListener(
    'click',
    event => {
        last_button = (event.target as Element).closest?.<HTMLButtonElement>(
            SubmitableButton
        );
    },
    true
);

document.addEventListener(
    'submit',
    function (event) {
        if ('submitter' in event) return;

        const form = event.target as HTMLFormElement,
            canditates = [document.activeElement, last_button];
        last_button = undefined;

        for (const control of canditates)
            if (
                control?.matches(SubmitableButton) &&
                form === (control as HTMLButtonElement).form
            )
                return (event.submitter = control as HTMLButtonElement);

        event.submitter = form.querySelector(SubmitableButton);
    },
    true
);
