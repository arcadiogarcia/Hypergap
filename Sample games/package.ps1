Add-Type -A System.IO.Compression.FileSystem
[IO.Compression.ZipFile]::CreateFromDirectory('FlappyNinjaCat', 'FlappyNinjaCat.hgp')