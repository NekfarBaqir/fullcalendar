import { BaseComponent } from '../vdom-util'
import { EventRenderRange } from './event-rendering'
import { EventInstanceHash } from '../structs/event-instance'
import { Hit } from '../interactions/hit'
import { elementClosest } from '../util/dom-manip'
import { guid } from '../util/misc'
import { Dictionary } from '../options'

export type DateComponentHash = { [uid: string]: DateComponent<any, any> }

// NOTE: for fg-events, eventRange.range is NOT sliced,
// thus, we need isStart/isEnd
export interface Seg {
  component?: DateComponent<any, any>
  isStart: boolean
  isEnd: boolean
  eventRange?: EventRenderRange
  [otherProp: string]: any // TODO: remove this. extending Seg will handle this
  el?: never
  // NOTE: can sometimes have start/end, which are important values :(
}

export interface EventSegUiInteractionState {
  affectedInstances: EventInstanceHash
  segs: Seg[]
  isEvent: boolean
}

/*
an INTERACTABLE date component

PURPOSES:
- hook up to fg, fill, and mirror renderers
- interface for dragging and hits
*/
export abstract class DateComponent<Props=Dictionary, State=Dictionary> extends BaseComponent<Props, State> {
  uid = guid()

  // Hit System
  // -----------------------------------------------------------------------------------------------------------------

  prepareHits() {
  }

  queryHit(positionLeft: number, positionTop: number, elWidth: number, elHeight: number): Hit | null {
    return null // this should be abstract
  }

  // Pointer Interaction Utils
  // -----------------------------------------------------------------------------------------------------------------

  isValidSegDownEl(el: HTMLElement) {
    return !(this.props as any).eventDrag && // HACK
      !(this.props as any).eventResize && // HACK
      !elementClosest(el, '.fc-event-mirror')
  }

  isValidDateDownEl(el: HTMLElement) {
    return !elementClosest(el, '.fc-event:not(.fc-bg-event)') &&
      !elementClosest(el, '.fc-event-more') && // a "more.." link
      !elementClosest(el, 'a[data-navlink]') && // a clickable nav link
      !elementClosest(el, '.fc-popover') // hack
  }
}
