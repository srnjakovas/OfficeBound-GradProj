USE [OfficeBound]
GO

INSERT INTO [dbo].[Users]
           ([Username]
           ,[Password]
           ,[Role]
           ,[Position]
           ,[DepartmentId]
           ,[IsApproved]
           ,[ReviewedDate]
           ,[CreatedDate])
     VALUES
           (N'manager'
           ,N'B0gPuehbk5avBvAGzxyVAkryUxxl+1Bc+9Ct0eLzFXM='
           ,2
           ,NULL
           ,NULL
           ,1
           ,N'2025-11-11 21:06:18.7987155'
           ,N'2025-11-11 21:06:18.7987155')


INSERT INTO [dbo].[Users]
           ([Username]
           ,[Password]
           ,[Role]
           ,[Position]
           ,[DepartmentId]
           ,[IsApproved]
           ,[ReviewedDate]
           ,[CreatedDate])
     VALUES
           (N'branchmanager'
           ,N'B0gPuehbk5avBvAGzxyVAkryUxxl+1Bc+9Ct0eLzFXM='
           ,3
           ,NULL
           ,NULL
           ,1
           ,N'2025-11-11 21:06:18.7987155'
           ,N'2025-11-11 21:06:18.7987155')

INSERT INTO [dbo].[Users]
           ([Username]
           ,[Password]
           ,[Role]
           ,[Position]
           ,[DepartmentId]
           ,[IsApproved]
           ,[ReviewedDate]
           ,[CreatedDate])
     VALUES
           (N'user'
           ,N'B0gPuehbk5avBvAGzxyVAkryUxxl+1Bc+9Ct0eLzFXM='
           ,0
           ,NULL
           ,NULL
           ,1
           ,N'2025-11-11 21:06:18.7987155'
           ,N'2025-11-11 21:06:18.7987155')


INSERT INTO [dbo].[Users]
           ([Username]
           ,[Password]
           ,[Role]
           ,[Position]
           ,[DepartmentId]
           ,[IsApproved]
           ,[ReviewedDate]
           ,[CreatedDate])
     VALUES
           (N'administrator'
           ,N'B0gPuehbk5avBvAGzxyVAkryUxxl+1Bc+9Ct0eLzFXM='
           ,1
           ,NULL
           ,NULL
           ,1
           ,N'2025-11-11 21:06:18.7987155'
           ,N'2025-11-11 21:06:18.7987155')