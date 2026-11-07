import { getContext, setContext } from 'svelte';

const CONTEXT_NAME = 'basePath';

type BasePathFunc = () => string;

export const setBasePathContext = (basePathFunc: BasePathFunc) =>
    setContext(CONTEXT_NAME, basePathFunc);
export const getBasePathContext = () => getContext<() => string>(CONTEXT_NAME)?.();
