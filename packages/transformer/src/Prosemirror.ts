import { Doc, applyUpdate, encodeStateAsUpdate } from 'yjs'
import { yDocToProsemirrorJSON, prosemirrorJSONToYDoc } from 'y-prosemirror'
import { Schema } from 'prosemirror-model'
import { Transformer } from './types'

export class ProsemirrorTransformer implements Transformer {

  static fromYdoc(document: Doc, fieldName: string | Array<string>): any {
    const data = {}

    // allow a single field name
    if (typeof fieldName === 'string') {
      return yDocToProsemirrorJSON(document, fieldName)
    }

    // default to all available fields if the given field name is empty
    if (fieldName.length === 0) {
      fieldName = Array.from(document.share.keys())
    }

    fieldName.forEach(field => {
      // @ts-ignore
      data[field] = yDocToProsemirrorJSON(document, field)
    })

    return data
  }

  static toYdoc(document: any, schema: Schema, fieldName: string | Array<string> = 'prosemirror'): Doc {
    // allow a single field name
    if (typeof fieldName === 'string') {
      return prosemirrorJSONToYDoc(schema, document, fieldName)
    }

    const ydoc = new Doc()

    fieldName.forEach(field => {
      const update = encodeStateAsUpdate(
        prosemirrorJSONToYDoc(schema, document, field),
      )

      applyUpdate(ydoc, update)
    })

    return ydoc
  }

}