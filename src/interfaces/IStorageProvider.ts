/**
 * Interface for storage providers (Local, S3, GCS, etc.)
 */
export interface IStorageProvider {
  /**
   * Store a file with the given content
   * @param location The path/key where the file should be stored
   * @param content The file content as Buffer or string
   */
  put(location: string, content: string | Buffer): Promise<void>;

  /**
   * Retrieve a file's content
   * @param location The path/key of the file to retrieve
   * @returns The file content as a Buffer
   */
  get(location: string): Promise<Buffer>;

  /**
   * Check if a file exists
   * @param location The path/key to check
   */
  exists(location: string): Promise<boolean>;

  /**
   * Delete a file
   * @param location The path/key of the file to delete
   */
  delete(location: string): Promise<void>;

  /**
   * Copy a file from one location to another
   * @param src Source path/key
   * @param dest Destination path/key
   */
  copy(src: string, dest: string): Promise<void>;

  /**
   * Move/rename a file
   * @param src Source path/key
   * @param dest Destination path/key
   */
  move(src: string, dest: string): Promise<void>;
}
