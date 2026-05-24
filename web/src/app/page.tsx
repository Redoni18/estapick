import { redirect } from 'next/navigation';

// The listings experience lives at `/listings` (per the assignment brief).
// Keeping the root URL alive but redirected means existing bookmarks, the
// Docker healthcheck, and any external link to `/` still land users on the
// listings page instead of a 404.
export default function RootRedirect() {
  redirect('/listings');
}
