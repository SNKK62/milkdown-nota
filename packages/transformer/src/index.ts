/* Copyright 2021, Milkdown by Mirone. */

/**
 * This hack is meant to fix https://github.com/lukeed/kleur/pull/54
 * kleur is a dependency of remark.
 */

if (process && !process.env) {
    process.env = {};
}
export * from './parser';
export * from './serializer';
export * from './utility';
export * from 'remark';
