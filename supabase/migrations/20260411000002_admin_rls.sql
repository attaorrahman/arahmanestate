-- Allow authenticated (admin) users to fully manage all tables

-- Properties: admin CRUD
CREATE POLICY "Authenticated users can insert properties"
  ON properties FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties"
  ON properties FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete properties"
  ON properties FOR DELETE TO authenticated USING (true);

-- Emirates: admin CRUD
CREATE POLICY "Authenticated users can insert emirates"
  ON emirates FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update emirates"
  ON emirates FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete emirates"
  ON emirates FOR DELETE TO authenticated USING (true);

-- Agents: admin CRUD
CREATE POLICY "Authenticated users can insert agents"
  ON agents FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update agents"
  ON agents FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete agents"
  ON agents FOR DELETE TO authenticated USING (true);

-- Inquiries: admin can read all
CREATE POLICY "Authenticated users can view inquiries"
  ON inquiries FOR SELECT TO authenticated USING (true);
