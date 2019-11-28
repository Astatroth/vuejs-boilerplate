/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find (list, f) {
    return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy (obj, cache = []) {
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj)
    if (hit) {
        return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy
    })

    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache)
    })

    return copy
}

/**
 * forEach for object
 */
export function forEachValue (obj, fn) {
    Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function isObject (obj) {
    return obj !== null && typeof obj === 'object'
}

export function isPromise (val) {
    return val && typeof val.then === 'function'
}

export function assert (condition, msg) {
    if (!condition) throw new Error(`[vuex] ${msg}`)
}

export function ucfirst (string, position = 0) {
    return string.charAt(position).toUpperCase() + string.slice(position + 1);
}

export function camelCase(string, separator = '_') {
    let parts = string.split(separator);

    if (parts.length === 1) {
        return ucfirst(parts[0]);
    }

    parts = parts.map((v) => {
        return ucfirst(v);
    });

    return parts.join('');
}

export function in_array(needle, haystack, strict) {
    var found = false, key, strict = !!strict;

    for (key in haystack) {
        if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
            found = true;
            break;
        }
    }

    return found;
}

export function userHasPermissions(user, test) {
    const permissions = Array.isArray(test) ? test : [test];

    return permissions.some((i) => {
        return in_array(i, user.permissions);
    });
}

export function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

export function arrayOnly(array, attr) {
    if (!array.isArray() || array.length < 1) {
        return false;
    }

    let fields = [];

    array.forEach((i, k) => {
        console.log(i, k);
    });
}

export function objectOnly(obj, attr) {
    if (!Object.keys(obj).length) {
        return false;
    }

    let fields = [];

    for (let item in obj) {
        if (obj.hasOwnProperty(item)) {
            fields.push(obj[item][attr]);
        }
    }

    return fields;
}

export function castRouteParams(route) {
    return {
        id: Number(route.params.id),
    };
}

/*!
 * Merge two or more objects together.
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
 * @param   {Object}   objects  The objects to merge together
 * @returns {Object}            Merged values of defaults and options
 */
export function extend () {

    // Variables
    var extended = {};
    var deep = false;
    var i = 0;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
        deep = arguments[0];
        i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                // If property is an object, merge properties
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                    extended[prop] = extend(extended[prop], obj[prop]);
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };

    // Loop through each object and conduct a merge
    for (; i < arguments.length; i++) {
        merge(arguments[i]);
    }

    return extended;

}