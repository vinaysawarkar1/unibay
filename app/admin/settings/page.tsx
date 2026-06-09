import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure your admin panel and store settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" placeholder="UniBay Custom PC" />
          </div>

          <div>
            <Label htmlFor="storeEmail">Store Email</Label>
            <Input id="storeEmail" type="email" placeholder="support@unibay.com" />
          </div>

          <div>
            <Label htmlFor="storePhone">Store Phone</Label>
            <Input id="storePhone" placeholder="+44 123 456 7890" />
          </div>

          <Button>Save Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To manage admin access, set the ADMIN_EMAILS environment variable with comma-separated email addresses.
          </p>
          <div>
            <Label htmlFor="adminEmails">Admin Emails (from .env)</Label>
            <Input
              id="adminEmails"
              disabled
              placeholder="Set via ADMIN_EMAILS env variable"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Admin features and tools can be managed through:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Products: Create, edit, delete products with images, specs, and pricing</li>
            <li>Orders: View and manage all customer orders with status tracking</li>
            <li>Users: Manage user accounts, addresses, and order history</li>
            <li>Blog: Create and publish blog posts with images and content</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
