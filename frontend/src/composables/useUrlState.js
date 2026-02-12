import pako from 'pako';

export function useUrlState(code) {
    // Compress and encode to URL-safe Base64
    const encode = (str) => {
        try {
            if (!str) return '';
            const data = new TextEncoder().encode(str);
            const compressed = pako.deflate(data, { level: 9 });

            // Use a safer way to convert Uint8Array to Base64
            const binString = Array.from(compressed, (byte) => String.fromCharCode(byte)).join('');
            const base64 = btoa(binString);

            // Make it URL-safe: Replace +, / and remove =
            return base64
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        } catch (e) {
            console.error('Compression/Encoding error:', e);
            return '';
        }
    };

    // Decode from URL-safe Base64 and decompress
    const decode = (base64) => {
        try {
            if (!base64) return '';

            // Restore standard Base64: Replace - and _ back
            let str = base64.replace(/-/g, '+').replace(/_/g, '/');

            // Add missing padding (=)
            while (str.length % 4) {
                str += '=';
            }

            const binString = atob(str);
            const bytes = new Uint8Array(binString.length);
            for (let i = 0; i < binString.length; i++) {
                bytes[i] = binString.charCodeAt(i);
            }

            const decompressed = pako.inflate(bytes);
            return new TextDecoder().decode(decompressed);
        } catch (e) {
            console.error('Decompression/Decoding error:', e);
            return '';
        }
    };

    const syncUrl = (newCode) => {
        const encoded = encode(newCode);
        if (encoded) {
            const newHash = `#code/${encoded}`;
            // Only replace if the hash actually changed to avoid cycles
            if (window.location.hash !== newHash) {
                window.history.replaceState(null, '', newHash);
            }
        }
    };

    const loadFromUrl = () => {
        const hash = window.location.hash;
        if (hash.startsWith('#code/')) {
            const encoded = hash.substring(6);
            if (encoded) {
                const decoded = decode(encoded);
                if (decoded) {
                    code.value = decoded;
                    return true;
                }
            }
        }
        return false;
    };

    const getShareUrl = () => {
        return window.location.origin + window.location.pathname + window.location.hash;
    };

    return {
        syncUrl,
        loadFromUrl,
        getShareUrl
    };
}
