// Hack to allow TypeScript to compile our UMD
declare let define: {
	amd: string;
	(stringValue, Function): any;
};
