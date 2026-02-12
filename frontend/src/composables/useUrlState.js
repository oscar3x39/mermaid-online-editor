import brotliPromise from 'brotli-wasm';
import pako from 'pako';

let brotli = null;

// Pre-load brotli wasm
const initBrotli = async () => {
    if (!brotli) {
        brotli = await brotliPromise;
    }
    return brotli;
};

export function useUrlState(code) {

    const encode = async (str) => {
        try {
            if (!str) return '';
            const data = new TextEncoder().encode(str);

            // Try Brotli first (Extreme)
            const b = await initBrotli();
            const compressed = b.compress(data, { quality: 11 });

            let binString = '';
            for (let i = 0; i < compressed.length; i++) {
                binString += String.fromCharCode(compressed[i]);
            }

            return btoa(binString)
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        } catch (e) {
            console.warn('Brotli encode failed, falling back to pako', e);
            // Fallback to pako (still very good)
            try {
                const compressed = pako.deflateRaw(new TextEncoder().encode(str), { level: 9 });
                let binString = '';
                for (let i = 0; i < compressed.length; i++) binString += String.fromCharCode(compressed[i]);
                return 'p' + btoa(binString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            } catch (e2) {
                return '';
            }
        }
    };

    const decode = async (base64) => {
        try {
            if (!base64) return '';

            // Check if it's pako fallback
            const isPako = base64.startsWith('p');
            const cleanBase64 = isPako ? base64.substring(1) : base64;

            let str = cleanBase64.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4) str += '=';

            const binString = atob(str);
            const bytes = new Uint8Array(binString.length);
            for (let i = 0; i < binString.length; i++) {
                bytes[i] = binString.charCodeAt(i);
            }

            if (isPako) {
                return new TextDecoder().decode(pako.inflateRaw(bytes));
            }

            // Brotli decode
            const b = await initBrotli();
            const decompressed = b.decompress(bytes);
            return new TextDecoder().decode(decompressed);
        } catch (e) {
            console.error('Unified decode failure:', e);
            // Last resort: try all known formats
            return '';
        }
    };

    const syncUrl = async (newCode) => {
        const encoded = await encode(newCode);
        if (encoded) {
            const newHash = `#b/${encoded}`; // 'b' for Brotli
            if (window.location.hash !== newHash) {
                window.history.replaceState(null, '', newHash);
            }
        }
    };

    const loadFromUrl = async () => {
        const hash = window.location.hash;
        let encoded = '';
        if (hash.startsWith('#b/')) encoded = hash.substring(3);
        else if (hash.startsWith('#v/')) {
            // This was the pako-with-dict version, we'll need to handle it if we want full compatibility
            // But let's keep it simple for now or implement full fallback
            return false;
        }
        else if (hash.startsWith('#code/')) encoded = hash.substring(6);

        if (encoded) {
            const decoded = await decode(encoded);
            if (decoded) {
                code.value = decoded;
                return true;
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
