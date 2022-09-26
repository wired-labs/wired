import { BehaviorSubject } from "rxjs";

import { PrimitiveMeshJSON } from "./types";

export class PrimitiveMesh {
  readonly type = "Primitive";

  name$ = new BehaviorSubject("Primitive");
  mode$ = new BehaviorSubject(4);
  indicesId$ = new BehaviorSubject<string | null>(null);

  POSITION$ = new BehaviorSubject<string | null>(null);
  NORMAL$ = new BehaviorSubject<string | null>(null);
  TANGENT$ = new BehaviorSubject<string | null>(null);
  TEXCOORD_0$ = new BehaviorSubject<string | null>(null);
  TEXCOORD_1$ = new BehaviorSubject<string | null>(null);
  COLOR_0$ = new BehaviorSubject<string | null>(null);
  JOINTS_0$ = new BehaviorSubject<string | null>(null);
  WEIGHTS_0$ = new BehaviorSubject<string | null>(null);

  get name() {
    return this.name$.value;
  }

  set name(name: string) {
    this.name$.next(name);
  }

  get mode() {
    return this.mode$.value;
  }

  set mode(mode: number) {
    this.mode$.next(mode);
  }

  get indicesId() {
    return this.indicesId$.value;
  }

  set indicesId(indicesId: string | null) {
    this.indicesId$.next(indicesId);
  }

  get POSITION() {
    return this.POSITION$.value;
  }

  set POSITION(POSITION: string | null) {
    this.POSITION$.next(POSITION);
  }

  get NORMAL() {
    return this.NORMAL$.value;
  }

  set NORMAL(NORMAL: string | null) {
    this.NORMAL$.next(NORMAL);
  }

  get TANGENT() {
    return this.TANGENT$.value;
  }

  set TANGENT(TANGENT: string | null) {
    this.TANGENT$.next(TANGENT);
  }

  get TEXCOORD_0() {
    return this.TEXCOORD_0$.value;
  }

  set TEXCOORD_0(TEXCOORD_0: string | null) {
    this.TEXCOORD_0$.next(TEXCOORD_0);
  }

  get TEXCOORD_1() {
    return this.TEXCOORD_1$.value;
  }

  set TEXCOORD_1(TEXCOORD_1: string | null) {
    this.TEXCOORD_1$.next(TEXCOORD_1);
  }

  get COLOR_0() {
    return this.COLOR_0$.value;
  }

  set COLOR_0(COLOR_0: string | null) {
    this.COLOR_0$.next(COLOR_0);
  }

  get JOINTS_0() {
    return this.JOINTS_0$.value;
  }

  set JOINTS_0(JOINTS_0: string | null) {
    this.JOINTS_0$.next(JOINTS_0);
  }

  get WEIGHTS_0() {
    return this.WEIGHTS_0$.value;
  }

  set WEIGHTS_0(WEIGHTS_0: string | null) {
    this.WEIGHTS_0$.next(WEIGHTS_0);
  }

  destroy() {
    this.name$.complete();
    this.mode$.complete();
    this.indicesId$.complete();
    this.POSITION$.complete();
    this.NORMAL$.complete();
    this.TANGENT$.complete();
    this.TEXCOORD_0$.complete();
    this.TEXCOORD_1$.complete();
    this.COLOR_0$.complete();
    this.JOINTS_0$.complete();
    this.WEIGHTS_0$.complete();
  }

  toJSON(): PrimitiveMeshJSON {
    return {
      type: this.type,
      name: this.name,
      mode: this.mode,
      indicesId: this.indicesId,
      POSITION: this.POSITION,
      NORMAL: this.NORMAL,
      TANGENT: this.TANGENT,
      TEXCOORD_0: this.TEXCOORD_0,
      TEXCOORD_1: this.TEXCOORD_1,
      COLOR_0: this.COLOR_0,
      JOINTS_0: this.JOINTS_0,
      WEIGHTS_0: this.WEIGHTS_0,
    };
  }

  applyJSON(json: Partial<PrimitiveMeshJSON>) {
    if (json.name !== undefined) this.name = json.name;
    if (json.mode !== undefined) this.mode = json.mode;
    if (json.indicesId !== undefined) this.indicesId = json.indicesId;
    if (json.POSITION !== undefined) this.POSITION = json.POSITION;
    if (json.NORMAL !== undefined) this.NORMAL = json.NORMAL;
    if (json.TANGENT !== undefined) this.TANGENT = json.TANGENT;
    if (json.TEXCOORD_0 !== undefined) this.TEXCOORD_0 = json.TEXCOORD_0;
    if (json.TEXCOORD_1 !== undefined) this.TEXCOORD_1 = json.TEXCOORD_1;
    if (json.COLOR_0 !== undefined) this.COLOR_0 = json.COLOR_0;
    if (json.JOINTS_0 !== undefined) this.JOINTS_0 = json.JOINTS_0;
    if (json.WEIGHTS_0 !== undefined) this.WEIGHTS_0 = json.WEIGHTS_0;
  }

  static fromJSON(json: PrimitiveMeshJSON) {
    const mesh = new PrimitiveMesh();
    mesh.applyJSON(json);
    return mesh;
  }
}
