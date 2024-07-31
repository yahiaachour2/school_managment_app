import {
  useEffect,
  useRef,
} from 'react';

export default function useClickOutside(callbackFn: () => void) {
    let domNodeRef = useRef<HTMLDivElement | null>(null); // Specify the type here

    useEffect(() => {
        let handler = (event: MouseEvent) => { // Adjusted type of event
            if (domNodeRef.current && !domNodeRef.current.contains(event.target as Node)) {
                callbackFn();
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [callbackFn]); // Ensure callbackFn is in the dependency array if it might change

    return domNodeRef;
}
