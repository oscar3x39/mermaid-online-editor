import pako from 'pako';

export function useUrlState(code) {
    // Compress and encode to URL-safe Base64
    const encode = (str) => {
        try {
            const data = new TextEncoder().encode(str);
            const compressed = pako.deflate(data, { level: 9 });
            // Convert to binary string
            let binString = '';
            const len = compressed.byteLength;
            for (let i = 0; i < len; i++) {
                binString += String.fromCharCode(compressed[i]);
            }
            // Convert to Base64 and make it URL-safe
            return btoa(binString)
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
            // Restore standard Base64
            let binString = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
            const len = binString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
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
            window.history.replaceState(null, '', `#code/${encoded}`);
        }
    };

    const loadFromUrl = () => {
        const hash = window.location.hash;
        if (hash.startsWith('#code/')) {
            const encoded = hash.substring(6);
            const decoded = decode(encoded);
            if (decoded) {
                code.value = decoded;
                return true;
            }
        }
        return false;
    };

    const getShareUrl = () => {
        return window.location.href;
    };

    return {
        syncUrl,
        loadFromUrl,
        getShareUrl
    };
}
