import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post';
import { schema } from '@ioc:Adonis/Core/Validator'

export default class PostsController {
    public messageStore = {
        required: 'The {{ field }} is required to create a Post',
    }

    public messageUpdate = {
        required: 'The {{ field }} is required to update a Post',
    }

    async index({ response }: HttpContextContract) {
        //get data from table posts
        let posts = await Post.query().orderBy('id', 'asc')

        //make response JSON
        return response.status(200).json({
            success: true,
            message: "List Data Post",
            data: posts
        })
    }

    async show({ response, params }: HttpContextContract) {
        let id = params.id
        let post = await Post.findOrFail(id)

        return response.status(200).json({
            success: true,
            message: "Detail Data Post",
            data: post
        })
    }

    async store({ request, response }: HttpContextContract) {
        const storePostSchema = schema.create({
            title: schema.string({ trim: true }),
            content: schema.string({ trim: true })
        })

        const payloadData = await request.validate({ schema: storePostSchema, messages: this.messageStore })

        const post = new Post()
        post.title = payloadData.title
        post.content = payloadData.content

        const model = await post.save()
        if (!model) {
            return response.status(200).json({
                success: false,
                message: "Post Failed to Save",
            })
        }
        return response.status(200).json({
            success: true,
            message: "Post Created",
            data: post
        })
    }

    async update({ request, response, params }: HttpContextContract) {
        let id = params.id
        const updatePostSchema = schema.create({
            title: schema.string({ trim: true }),
            content: schema.string({ trim: true })
        })

        const payloadData = await request.validate({ schema: updatePostSchema, messages: this.messageUpdate })

        const post = await Post.findOrFail(id)
        post.title = payloadData.title
        post.content = payloadData.content

        const model = await post.save()
        if (!model) {
            return response.status(404).json({
                success: false,
                message: "Post Not Found",
            })
        }
        return response.status(200).json({
            success: true,
            message: "Post Updated",
            data: post
        })
    }

    async destroy({ response, params }: HttpContextContract) {
        let id = params.id
        let post = await Post.find(id)
        if (post) {
            await post.delete()
            return response.status(200).json({
                success: true,
                message: "Post Delete",
            })
        }

        return response.status(404).json({
            success: false,
            message: "Post Not Found",
        })
    }
}
