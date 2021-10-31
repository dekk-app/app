import { MutableRefObject, useEffect } from "react";

export const useOnClickOutside = (
	ref: MutableRefObject<Element>,
	handler: (event_: MouseEvent) => void
) => {
	useEffect(
		() => {
			const listener = (event_: MouseEvent) => {
				if (!ref.current?.contains(event_.target as Node)) {
					handler(event_);
				}
			};

			document.addEventListener("mousedown", listener);
			document.addEventListener("touchstart", listener);
			return () => {
				document.removeEventListener("mousedown", listener);
				document.removeEventListener("touchstart", listener);
			};
		},
		// Add ref and handler to effect dependencies
		// It's worth noting that because passed in handler is a new ...
		// ... function on every render that will cause this effect ...
		// ... callback/cleanup to run every render. It's not a big deal ...
		// ... but to optimize you can wrap handler in useCallback before ...
		// ... passing it into this hook.
		[ref, handler]
	);
};
