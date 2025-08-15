import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';



export class Account {
  public readonly title: WritableSignal<string>;
  public readonly isVisible: WritableSignal<boolean>;
  public readonly description: WritableSignal<string>;

  constructor(
    public readonly numbering: string,
    title: string,
    isVisible: boolean,
    description: string = '',
    public readonly id: string = uuidv4()
  ) {
    this.title = signal(title);
    this.isVisible = signal(isVisible);
    this.description = signal(description);
  }
}

abstract class AccountNodeBase {
  private readonly childrenSignal: WritableSignal<AccountNode[]>;

  protected updateChildrenSignal(updateFn: (children: AccountNode[]) => AccountNode[]): void {
    this.childrenSignal.update(updateFn);
  }

  protected constructor(
    children: AccountNode[] = []
  ) {
    this.childrenSignal = signal(children);
  }

  public get children(): Signal<AccountNode[]> {
    return this.childrenSignal.asReadonly();
  }

  public addAccount(
    numbering: string,
    title: string,
    isVisible: boolean = true
  ): AccountNode {
    const node = new AccountNode(
      new Account(
        numbering,
        title,
        isVisible
      ),
      this,
      []
    );
    this.addChild(node);

    return node;
  }

  public removeAccount(id: string): void {
    this.childrenSignal.update(children => children.filter(c => c.account.id !== id));
  }

  public addChild(child: AccountNode): void {
    this.childrenSignal.update(children => [...children, child]);
  }

  public removeChild(child: AccountNode): void {
    this.childrenSignal.update(children => children.filter(c => c !== child));
  }

  public getAccount(id: string): AccountNode | null {
    for (const c of this.childrenSignal()) {
      if (c.account.id === id) {
        console.log(c);
        return c;
      }

      const account = c.getAccount(id);
      if (account !== null) {
        return account;
      }
    }

    return null;
  }

  public getDepth(): number {
    const children = this.childrenSignal();
    if (children.length === 0) {
      return 0;
    }

    return 1 + Math.max(...children.map(c => c.getDepth()));
  }
}

export class RootAccountNode extends AccountNodeBase {
  public constructor() {
    super();
  }
}

export class AccountNode extends AccountNodeBase {
  public readonly account: Account;
  private readonly parentSignal: WritableSignal<AccountNodeBase>;

  constructor(
    account: Account,
    parent: AccountNodeBase,
    children: AccountNode[] = []
  ) {
    super(children);
    this.account = account;
    this.parentSignal = signal(parent);
  }

  public get parent(): Signal<AccountNodeBase> {
    return this.parentSignal.asReadonly();
  }

  public override addChild(child: AccountNode): void {
    super.addChild(child);
    child.parentSignal.set(this);
  }

  public override removeChild(child: AccountNode): void {
    super.removeChild(child);
  }

  public setParent(newParent: AccountNodeBase): void {
    if (AccountNode.isAncestor(
      this,
      newParent
    )) {
      throw new Error('Cannot set parent: would create circular reference.');
    }

    const oldParent = this.parentSignal();
    if (oldParent && oldParent !== newParent) {
      oldParent.removeAccount(this.account.id);
    }

    // Set new parent
    this.parentSignal.set(newParent);

    // Add to new parent's children if not already present
    if (!newParent.children().includes(this)) {
      newParent.addChild(this);
    }
  }

  public static isAncestor(
    potentialAncestor: AccountNodeBase,
    node: AccountNodeBase
  ): boolean {
    let current: AccountNodeBase | undefined = node;

    while (current) {
      if (current === potentialAncestor) {
        return true;
      }
      if (!(current instanceof AccountNode)) {
        break;
      }
      current = current.parent();
    }

    return false;
  }

  public hasDescendantOrSelf(node: AccountNodeBase): boolean {
    if (this === node) {
      return true;
    }
    for (const child of this.children()) {
      if (child.hasDescendantOrSelf(node)) {
        return true;
      }
    }
    return false;
  }

  public getParentPath(): AccountNode[] {
    const path: AccountNode[] = [];

    this.traverseParents(
      path
    );

    return path;
  }

  private traverseParents(nodes: AccountNode[]): void {
    const parent = this.parentSignal();
    if (parent instanceof AccountNode) {
      nodes.push(parent);
      parent.traverseParents(nodes);
      return;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public readonly rootNode: RootAccountNode = new RootAccountNode();

  public constructor() {
    let a1 = this.rootNode.addAccount(
      'A',
      'Ausgaben'
    );
    let a2 = a1.addAccount(
      '1',
      'AStA'
    );
    let a3 = a2.addAccount(
      '10',
      'Finanzreferat',
      false
    );
    let a4 = a3.addAccount(
      '2',
      'Sachkosten',
      false
    );
    let e1 = this.rootNode.addAccount(
      'E',
      'Einnahmen',
      true
    );
    /*a3.setParent(this.rootNode);
    a2.setParent(this.rootNode);*/
  }
}
