import axios from 'axios';

export class PostService {
  static BASE_URL_WP_POSTS_EMBED =
    'https://www.erime.eu/wp-json/wp/v2/posts?_embed';

  static async loadCategoryBySlug(slug: string) {
    return await axios.get(
      `https://www.erime.eu/wp-json/wp/v2/categories?slug=${slug}`
    );
  }

  static async loadCategoryPosts(categoryId: string, page?: number) {
    const usedPage = page ? page : 1;
    return await axios.get(
      `${PostService.BASE_URL_WP_POSTS_EMBED}&categories=${categoryId}&page=${usedPage}`
    );
  }

  static async loadSearchPosts(searchString: string, page?: number) {
    const usedPage = page ? page : 1;
    return await axios.get(
      `${PostService.BASE_URL_WP_POSTS_EMBED}&search=${searchString}&page=${usedPage}`
    );
  }

  static async loadPost(slug: string) {
    return await axios.get(
      `${PostService.BASE_URL_WP_POSTS_EMBED}&slug=${slug}`
    );
  }

  static async loadPosts(page?: number) {
    const usedPage = page ? page : 1;
    return await axios.get(
      `${PostService.BASE_URL_WP_POSTS_EMBED}&page=${usedPage}`
    );
  }
}
