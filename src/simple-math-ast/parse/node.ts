import {Token} from '../config';

class ASTNode {
	token: Token;
	left: ASTNode | null;
	right: ASTNode | null;
	constructor(token: Token) {
		this.token = token;

		this.left = null;
		this.right = null;
	}

	setRight(node: ASTNode | null) {
		this.right = node;
	}

	setLeft(node: ASTNode | null) {
		this.left = node;
	}
}

export default ASTNode;
