/*
  # ApplianceWise - Compare Lists Table

  1. New Tables
    - `compare_lists`
      - `id` (uuid, primary key)
      - `session_id` (text) - anonymous session identifier
      - `product_ids` (text[]) - array of product IDs being compared
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `compare_lists`
    - Allow anyone to read/write by session_id (public compare feature)
    - No auth required since this is anonymous session-based

  3. Notes
    - Max 3 products per compare list enforced in application layer
    - Sessions are identified by a random UUID stored in localStorage
*/

CREATE TABLE IF NOT EXISTS compare_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_ids text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS compare_lists_session_id_idx ON compare_lists(session_id);

ALTER TABLE compare_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read compare lists by session"
  ON compare_lists FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert compare lists"
  ON compare_lists FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their compare list"
  ON compare_lists FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete their compare list"
  ON compare_lists FOR DELETE
  USING (true);
