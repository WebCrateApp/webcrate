import DetaOrm from 'deta-base-orm'

export type Tag = {
	key: string
	name: string
}

const schema = new DetaOrm.Schema<Tag>({
    name: 'string',
})

export const Tags = new DetaOrm.Base('tags', schema)