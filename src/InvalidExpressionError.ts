export class InvalidExpressionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidExpressionError';
	}
}
